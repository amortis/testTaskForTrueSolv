import {LightningElement, track} from 'lwc';
import getHelloWorld from '@salesforce/apex/helloWorldController.getHelloWorld';

export default class HelloWorld extends LightningElement {

    @track greeting;

    connectedCallback(){
        getHelloWorld({name: 'Egor'})
            .then(result => {
                this.greeting = result;
            })
            .catch(error => {
                console.error(error);
            })
    }
}