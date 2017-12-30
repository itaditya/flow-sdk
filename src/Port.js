import Util from './Util';
import Component from './Component';
import Variable from './Variable';
import EventEmitter from 'events';

class Port {
    constructor(name) {

        //set initial properties
        if(!name){
            throw "Port Name is required.";
        }

        this.name = name;
        this._id = Util.generateId();
        this._connectedComponents = [];
        this._componentAttachedTo = null;
        this._variables = [];
        this._socket = new EventEmitter();
    }

    addVariable(variable){
        if(variable instanceof Variable){
            if(!variable.id)
                throw "Variable does not have an ID.";

            for(let i=0;i<this._variables.length;i++){
                if(variable.name === this._variables[i].name || variable.id === this._variables[i].id){
                    throw "Variable with the same name or id already exists.";
                }
            }

            this._variables.push(variable);
        }else{
            throw "variables should be an instance of Variable class.";
        }
    }

    removeVariable(variable){
        if(variable instanceof Variable ||  typeof variable === 'string'){
            if(variable instanceof Variable && !variable.id)
                throw "Variable does not have an ID.";

            for(let i=0;i<this._variables.length;i++){

                if(typeof variable === 'string'){
                    if(variable === this._variables[i].name){
                        this._variables.slice(i,1);
                    }
                }else{
                    if(variable.name === this._variables[i].name || variable.id === this._variables[i].id){
                        this._variables.slice(i,1);
                    }
                }
            }
        }else{
            throw "variables should be an instance of Variable class.";
        }
    }

    updateVariable(variable){
        if(variable instanceof Variable){
            if(!variable.id)
                throw "Variable does not have an ID.";

            for(let i=0;i<this._variables.length;i++){
                if(variable.name === this._variables[i].name || variable.id === this._variables[i].id){
                    this._variables[i] = variable;
                    return;
                }
            }

            throw "Variable not found and is not updated.";
        }else{
            throw "variables should be an instance of Variable class.";
        }
    }


    hasVariable(variable){
        if(variable instanceof Variable ||  typeof variable === 'string'){
            if(variable instanceof Variable && !variable.id)
                throw "Variable does not have an ID.";

            for(let i=0;i<this._variables.length;i++){

                if(typeof variable === 'string'){
                    if(variable === this._variables[i].name){
                        return true;
                    }
                }else{
                    if(variable.name === this._variables[i].name || variable.id === this._variables[i].id){
                        return true;
                    }
                }
            }
           return false;
        }else{
            throw "variables should be an instance of Variable class.";
        }
    }

    //This passes the flow to components that this port is connected to. 
    emit(){
        for(var i=0;i<this._connectedComponents; i++){
            this._socket.emit("execute-component-"+this._connectedComponents[i]);
        }

        //Fire an onEmit Callback.
        if(this._onEmit)
            this._onEmit(); 
    }

    onEmit(callback){
        this._onEmit = callback;
    }

    connectComponent(component){
        if(component instanceof Component){
            if(!component.id)
                throw "Component does not have an ID.";
            
            var componentId = component.id;

            for(let i=0;i<this._connectedComponents.length;i++){
                if(componentId === this._connectedComponents[i]){
                    throw "Port is already connected to "+component.name+".";
                }
            }
            
            this._connectedComponents.push(componentId);
        }else{
            throw "component should be an instance of Component class.";
        }
    }


    getVariable(variable){
        if(variable instanceof Variable ||  typeof variable === 'string'){
            if(variable instanceof Variable && !variable.id)
                throw "Variable does not have an ID.";

            for(let i=0;i<this._variables.length;i++){
                if(typeof variable === 'string'){
                    if(variable === this._variables[i].name){
                        return this._variables[i];
                    }
                }else{
                    if(variable.name === this._variables[i].name || variable.id === this._variables[i].id){
                        return this._variables[i];
                    }
                }
            }

            throw "Variable not found.";
        }else{
            throw "Variable should be an instance of variable class.";
        }
    }

    serialize(){
        return JSON.stringify(this);
    }

    disconnectComponent(component){
        if(component instanceof Component){
            if(!component.id)
                throw "Component does not have an ID.";
            
            var componentId = component.id;
            if(this._connectedComponents.indexOf(componentId) < 0){
                throw "Component is not connected to the port.";
            }

            this._connectedComponents.slice(this._connectedComponents.indexOf(componentId),1); 
        }else{
            throw "component should be an instance of Component class.";
        }
    }

    getConnectedComponentIds(){
        return this._connectedComponents;
    }

    //getters and setters
    get description() {
        return this._description;
    }

    set description(description) {
        
        if (!Util.validate(description, 'string')) {
            throw 'Description must be a string.'
        }

        this._description = description;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        if (!Util.validate(name, 'string')) {
            throw 'Name must be a string.'
        }
        this._name = name;
    }

    get id() {
        return this._id;
    }

}

module.exports = Port;