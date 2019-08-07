/* eslint-disable no-console */
import { LightningElement, track } from 'lwc';
import search from '@salesforce/apex/SearchComponentController.search';

export default class SearchComponent extends LightningElement {
    
    @track searchTerm;
    @track results;
    @track hasResults = false;

    updateTerm(event){
        console.log(event.target.value);
        this.searchTerm = event.target.value;
    }

    search(){
        if(this.searchTerm.length >= 2){
            console.log('Searching...');
            search({ searchTerm: this.searchTerm })
                .then(result => {
                    console.log(result);
                    this.hasResults = true;
                    this.results = JSON.parse(result);
                })
                .else(error => {
                    this.hasResults = false;
                    console.log(error);
                });
        }
    }
    
    searchTypeahead(event){
        this.updateTerm(event);
        this.search();
    }
}