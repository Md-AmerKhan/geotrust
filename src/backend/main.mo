import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Migration "migration";

// Use the explicit migration defined in migration.mo
(with migration = Migration.run)
actor {
  type Article = {
    id : Nat;
    title : Text;
    source : Text;
    url : Text;
    publishedAt : Text;
    description : Text;
    imageUrl : Text;
  };

  module Article {
    public func compareByPublishedAtDesc(a : Article, b : Article) : Order.Order {
      Text.compare(b.publishedAt, a.publishedAt);
    };
  };

  var apiKey : Text = "";
  var lastFetchedAt : Int = 0;
  var articles = [
    {
      id = 1;
      title = "Tensions Rise Between Iran and Israel Amid Nuclear Concerns";
      source = "BBC News";
      url = "https://www.bbc.com/news/world-67943260";
      publishedAt = "2024-04-12T15:30:00Z";
      description = "Diplomatic efforts intensify as Iran continues its nuclear program, raising fears of a regional conflict involving Israel and the United States.";
      imageUrl = "https://www.bbc.com/images/iran-israel-tensions.jpg";
    },
    {
      id = 2;
      title = "US Imposes New Sanctions on Iran Over Alleged Terrorism Links";
      source = "Reuters";
      url = "https://www.reuters.com/news/us-sanctions-iran-2024-04-11";
      publishedAt = "2024-04-11T18:45:00Z";
      description = "The United States has imposed a new round of economic sanctions on Iran, targeting individuals and entities linked to alleged terrorist activities.";
      imageUrl = "https://www.reuters.com/images/us-iran-sanctions.jpg";
    },
    {
      id = 3;
      title = "Israel Launches Military Exercise Simulating Multi-Front War";
      source = "CNN";
      url = "https://www.cnn.com/world/israel-military-exercise-2024-04-10";
      publishedAt = "2024-04-10T12:20:00Z";
      description = "The Israeli Defense Forces have begun a large-scale military exercise simulating a potential conflict with Iran and its regional allies.";
      imageUrl = "https://www.cnn.com/images/israel-military-exercise.jpg";
    },
    {
      id = 4;
      title = "Iran Responds to Accusations of Nuclear Weapons Development";
      source = "The Guardian";
      url = "https://www.theguardian.com/world/iran-nuclear-response-2024-04-09";
      publishedAt = "2024-04-09T09:15:00Z";
      description = "Iranian officials have denied Western accusations of developing nuclear weapons, insisting their program is for peaceful purposes.";
      imageUrl = "https://www.theguardian.com/images/iran-nuclear-response.jpg";
    },
    {
      id = 5;
      title = "US and Israel Conduct Joint Naval Exercise in Persian Gulf";
      source = "Al Jazeera";
      url = "https://www.aljazeera.com/news/us-israel-naval-exercise-2024-04-08";
      publishedAt = "2024-04-08T16:30:00Z";
      description = "The United States and Israel have conducted a joint naval exercise in the Persian Gulf, showcasing their military cooperation in the region.";
      imageUrl = "https://www.aljazeera.com/images/us-israel-naval-exercise.jpg";
    },
    {
      id = 6;
      title = "Iran Warns of Retaliation Against Any Israeli Aggression";
      source = "Associated Press";
      url = "https://www.apnews.com/world/iran-warns-israel-retaliation-2024-04-07";
      publishedAt = "2024-04-07T11:00:00Z";
      description = "Iran has issued a stern warning to Israel, promising retaliation if any military aggression is carried out against the Islamic Republic.";
      imageUrl = "https://www.apnews.com/images/iran-warns-israel.jpg";
    },
    {
      id = 7;
      title = "US Secretary of State Calls for De-Escalation in Middle East";
      source = "Bloomberg";
      url = "https://www.bloomberg.com/news/us-calls-de-escalation-middle-east-2024-04-06";
      publishedAt = "2024-04-06T14:45:00Z";
      description = "The US Secretary of State has urged all parties in the Middle East to seek peaceful solutions and avoid further escalation of tensions.";
      imageUrl = "https://www.bloomberg.com/images/us-de-escalation.jpg";
    },
    {
      id = 8;
      title = "Israel Accuses Iran of Supporting Regional Militias";
      source = "Financial Times";
      url = "https://www.ft.com/world/israel-accuses-iran-militias-2024-04-05";
      publishedAt = "2024-04-05T17:30:00Z";
      description = "Israeli officials have accused Iran of providing financial and military support to various militias across the Middle East.";
      imageUrl = "https://www.ft.com/images/israel-iran-militias.jpg";
    },
  ];
  // For testing, add fetchLatestNews and save GNews references in a persistent text value

  public shared ({ caller }) func setApiKey(key : Text) : async () {
    apiKey := key;
  };

  public query ({ caller }) func getLatestArticles() : async [Article] {
    let sorted = articles.sort(Article.compareByPublishedAtDesc);
    let maxCount = Nat.min(50, sorted.size());
    sorted.sliceToArray(0, maxCount);
  };

  public query ({ caller }) func searchArticles(term : Text) : async [Article] {
    if (term.size() == 0) {
      Runtime.trap("Search term cannot be empty.\nExample requests:\n\"Iran nuclear\", \"Sanctions\", \"Middle East\", \"Nuclear diplomacy\", \"Israel airstrike\".");
    };
    let loweredTerm = term.toLower();
    let filtered = articles.filter(func(article) {
      let titleMatch = article.title.toLower().contains(#text loweredTerm);
      let descMatch = article.description.toLower().contains(#text loweredTerm);
      titleMatch or descMatch;
    });
    filtered.sort(Article.compareByPublishedAtDesc);
  };

  public query ({ caller }) func getLastFetchedAt() : async Int {
    lastFetchedAt;
  };
};
