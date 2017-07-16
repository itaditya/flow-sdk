import CBFlow from './CBFlow';
import {
    validate
} from '../util'
class Component {
    constructor() {
        //set initial properties
        this._description = '';
        this._inPorts = [];
        this._outPorts = [];
        this._process = null;
    }

    addInPort(name, options) {
        
        if(!options){
            throw "options parameter is required"
        }

        if (!name)
            throw "Inport name is required"
        if (!validate(name, 'string'))
            throw "Port name should be of type string."

        //TODO: validate datatype

        this.inPorts.push(new CBFlow.InPort(name,options));

    }

    addOutPort(name,options) {

        if(!options){
            throw "options parameter is required"
        }

        if (!name) {
            throw "Inport name is required"
        }

        if (!validate(name, 'string')) {
            throw "Port name should be of type string."
        }

        //TODO: validate datatype

        this.outPorts.push(
            new CBFlow.OutPort(name, options)
        )

    }

    execute(){
        this._process(new CBFlow.ProcessInput(),new CBFlow.ProcessOutput())
    }

    process(handle) {

        if (!validate(handle, 'function')) {
            throw 'Process handler must be a function.'
        }
        if (!this.inPorts) {
            throw new Error("Component ports must be defined before process function");
        }
        this._process = handle;

    }

    get description() {
        return this.description
    }

    set description(description) {
        this._description = description
    }

    get inPorts() {
        return this._inPorts
    }

    get outPorts() {
        return this.outPorts
    }

    get process() {
        return this._process
    }

}
CBFlow.Component = Component
export default Component