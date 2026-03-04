import List "mo:core/List";

module {
  type OldArticle = {
    id : Nat;
    title : Text;
    source : Text;
    link : Text;
    published_date : Text;
    ai_summary : Text;
    why_it_matters : Text;
    created_at : Int;
  };

  type OldActor = {
    articles : List.List<OldArticle>;
    sources : [Text];
  };

  type NewArticle = {
    id : Nat;
    title : Text;
    source : Text;
    url : Text;
    publishedAt : Text;
    description : Text;
    imageUrl : Text;
  };

  type NewActor = {
    apiKey : Text;
    lastFetchedAt : Int;
    articles : [NewArticle];
  };

  public func run(old : OldActor) : NewActor {
    let newArticles = old.articles.toArray().map<OldArticle, NewArticle>(
      func(oldArticle) {
        {
          oldArticle with
          url = oldArticle.link;
          publishedAt = oldArticle.published_date;
          description = oldArticle.ai_summary # oldArticle.why_it_matters;
          imageUrl = "default_image_url";
        };
      }
    );
    {
      apiKey = "";
      lastFetchedAt = 0;
      articles = newArticles;
    };
  };
};
