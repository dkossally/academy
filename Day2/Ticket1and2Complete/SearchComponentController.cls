public with sharing class SearchComponentController {
    
    public static Integer MAX_RESULTS = 100;

    //Data Transfer Object
    class SearchResult{
        String id;
        String sobjectname;
        String icon;
        String name;

        public SearchResult(String id, String sobjectname, String icon, String name){
            this.id = id;
            this.sobjectname = sobjectname;
            this.icon = icon;
            this.name = name;
        }
    }

    @AuraEnabled
    public static String search(String searchTerm){

        // Prepare query paramters
        searchTerm += '*';

        // Execute search query
        List<List<SObject>> searchResults = [FIND :searchTerm IN ALL FIELDS RETURNING
            Account (Id, Name),
            Opportunity (Id, Name),
            Lead (Id, Name)
            LIMIT :MAX_RESULTS];

        // Prepare results
        List<SearchResult> results = new List<SearchResult>();

        // Extract Accounts & convert them into SearchResult
        String accountIcon = 'standard:account';
        Account [] accounts = ((List<Account>) searchResults[0]);
        for (Account account : accounts) {
            results.add(new SearchResult(account.Id, 'Account', accountIcon, account.Name));
        }

        // Extract Opportunities & convert them intoSearchResult
        String opptyIcon = 'standard:opportunity';
        Opportunity [] opptys = ((List<Opportunity>) searchResults[1]);
        for (Opportunity oppty : opptys) {
            results.add(new SearchResult(oppty.Id, 'Opportunity', opptyIcon, oppty.Name));
        }

        // Extract Opportunities & convert them into SearchResult
        String leadIcon = 'standard:lead';
        Lead [] leads = ((List<Lead>) searchResults[2]);
        for (Lead lead : leads) {
            results.add(new SearchResult(lead.Id, 'Lead', leadIcon, lead.Name));
        }

        System.debug(results);
        return JSON.serialize(results);

    }

}
