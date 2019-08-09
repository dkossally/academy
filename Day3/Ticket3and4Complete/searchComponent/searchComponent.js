/* eslint-disable no-console */
import { LightningElement, track } from 'lwc';
import search from '@salesforce/apex/SearchComponentController.search';
import getBookmarks from "@salesforce/apex/SearchComponentController.getBookmarks";
import saveBookmark from "@salesforce/apex/SearchComponentController.saveBookmark";

export default class SearchComponent extends LightningElement {
    
    @track searchTerm;
    @track results;
    @track bookmarks;
    @track hasResults = false;
    @track initialRender = true;

    renderedCallback(){
        if(this.initialRender){
            this.getCurrentBookmarks();
            this.initialRender = false;
        }
    }

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
                .catch(error => {
                    this.hasResults = false;
                    console.log(error);
                });
        }
    }
    
    searchTypeahead(event){
        this.updateTerm(event);
        this.search();
    }

    getCurrentBookmarks(){
        getBookmarks()
            .then(result => {
                console.log("Has Bookmarks");
                console.log(result);
                this.bookmarks = JSON.parse(result);
            })
            .catch(error => {
                console.log(error);
            });
    }

    createBookmark(event){
        saveBookmark({ id: event.target.dataset.id, sobjectname: event.target.dataset.object})
            .then(result => {
                console.log(result);
                if(result === true){
                    this.search();
                    this.getCurrentBookmarks();
                }
            })
            .catch(error => {
                this.hasResults = false;
                console.log(error);
            });
    }

    // removeBookmark(event){
        
    // }
}