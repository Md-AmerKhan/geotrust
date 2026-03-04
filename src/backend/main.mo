import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Article = {
    id : Nat;
    title : Text;
    source : Text;
    url : Text;
    publishedAt : Text;
    publishedAtUnix : Int;
    description : Text;
    imageUrl : Text;
  };

  var apiKey : Text = "";
  var lastFetchedAt : Int = 0;
  var articles : [Article] = [
    {
      id = 1;
      title = "Iran Launches Ballistic Missile Barrage at Israeli Cities — March 4, 2026";
      source = "BBC News";
      url = "https://www.bbc.com/news/world-middle-east";
      publishedAt = "2026-03-04T05:00:00Z";
      publishedAtUnix = 1772600400;
      description = "Iran fired a wave of ballistic missiles toward central Israel in the early hours of March 4, 2026, triggering air-raid sirens across Tel Aviv and Jerusalem. Israel's Iron Dome intercepted most projectiles; the IDF confirmed several impacts. US officials are in emergency consultations.";
      imageUrl = "";
    },
    {
      id = 2;
      title = "IDF Strikes Iran's Natanz Nuclear Site in Overnight Airstrike";
      source = "Reuters";
      url = "https://www.reuters.com/world/middle-east";
      publishedAt = "2026-03-04T03:00:00Z";
      publishedAtUnix = 1772593200;
      description = "Israeli Air Force jets struck the Natanz nuclear enrichment facility in a pre-dawn attack on March 4, 2026, causing significant structural damage according to satellite imagery. Tehran has vowed a crushing retaliation and placed its armed forces on highest alert.";
      imageUrl = "";
    },
    {
      id = 3;
      title = "US Carrier Strike Group Moves Into Persian Gulf as Iran Conflict Escalates";
      source = "CNN";
      url = "https://www.cnn.com/world/middle-east";
      publishedAt = "2026-03-04T01:00:00Z";
      publishedAtUnix = 1772586000;
      description = "The USS Gerald R. Ford carrier strike group entered the Persian Gulf on March 4 following orders from the Pentagon. The deployment is described as a deterrence measure after Iran's ballistic missile attack on Israel overnight.";
      imageUrl = "";
    },
    {
      id = 4;
      title = "Israel Declares State of Emergency After Iranian Missile Strike — 3rd March";
      source = "Al Jazeera";
      url = "https://www.aljazeera.com/news";
      publishedAt = "2026-03-03T23:00:00Z";
      publishedAtUnix = 1772578800;
      description = "Israeli Prime Minister declared a national state of emergency on the evening of March 3, 2026, after Iranian missiles struck suburbs south of Tel Aviv. At least 11 people were reported injured. Thousands have been directed to shelters.";
      imageUrl = "";
    },
    {
      id = 5;
      title = "US Deploys Patriot Missile Batteries to Israel Amid Iran War Threat";
      source = "Associated Press";
      url = "https://www.apnews.com/world/middle-east";
      publishedAt = "2026-03-03T21:00:00Z";
      publishedAtUnix = 1772571600;
      description = "The US Defense Department announced on March 3 the urgent deployment of additional Patriot air-defense batteries to Israel. The move comes hours after Iran launched its most intense missile salvo since the conflict began.";
      imageUrl = "";
    },
    {
      id = 6;
      title = "Iran-Israel War: Day-by-Day Timeline — What Happened on 3 March 2026";
      source = "The Guardian";
      url = "https://www.theguardian.com/world/middle-east";
      publishedAt = "2026-03-03T19:00:00Z";
      publishedAtUnix = 1772564400;
      description = "A comprehensive timeline of March 3 military exchanges: Iran's Revolutionary Guard Corps launched drones targeting Haifa port at 06:00 UTC; Israel responded with F-35 strikes on IRGC depots in Syria; Washington issued emergency diplomatic warnings to Tehran.";
      imageUrl = "";
    },
    {
      id = 7;
      title = "Iran-Backed Militias Strike US Bases in Iraq and Syria — March 3";
      source = "Bloomberg";
      url = "https://www.bloomberg.com/news/middle-east";
      publishedAt = "2026-03-03T17:00:00Z";
      publishedAtUnix = 1772557200;
      description = "Iran-aligned militia groups launched coordinated rocket and drone attacks against US military installations at Al-Asad Airbase in Iraq and Tanf garrison in Syria on March 3. Several US service members were wounded; retaliatory US airstrikes hit militia command centers.";
      imageUrl = "";
    },
    {
      id = 8;
      title = "UN Security Council Holds Emergency Session on Iran-Israel War — March 3";
      source = "Financial Times";
      url = "https://www.ft.com/world/middle-east";
      publishedAt = "2026-03-03T15:00:00Z";
      publishedAtUnix = 1772550000;
      description = "The UN Security Council convened an emergency session on March 3, 2026, as the Iran-Israel conflict reached its highest intensity. The US and UK vetoed a Russian-Chinese draft calling for an immediate ceasefire; a counter-resolution urging de-escalation failed to pass.";
      imageUrl = "";
    },
    {
      id = 9;
      title = "Iran Warns US: Any Intervention Will Make You a Legitimate Target";
      source = "Al Jazeera";
      url = "https://www.aljazeera.com/news";
      publishedAt = "2026-03-03T13:00:00Z";
      publishedAtUnix = 1772542800;
      description = "Iran's Supreme Leader issued a direct warning to the United States on March 3, stating that any military intervention in support of Israel would make US forces and bases in the region legitimate military targets. Washington called the statement unacceptable and dangerous.";
      imageUrl = "";
    },
    {
      id = 10;
      title = "Israel Intercepts Hypersonic Missile in Historic Air Defense Success — March 3";
      source = "BBC News";
      url = "https://www.bbc.com/news/world-middle-east";
      publishedAt = "2026-03-03T11:00:00Z";
      publishedAtUnix = 1772535600;
      description = "Israel's Arrow-3 defense system successfully intercepted what military analysts described as a hypersonic ballistic missile fired from Iran on March 3. The IDF called it the first combat interception of a hypersonic weapon in history. Iran denied it was a hypersonic projectile.";
      imageUrl = "";
    },
  ];

  func isFresh(publishedAtUnix : Int) : Bool {
    let nowSeconds : Int = Time.now() / 1_000_000_000;
    let ageSeconds = nowSeconds - publishedAtUnix;
    ageSeconds >= 0 and ageSeconds <= 129_600; // 36 hours
  };

  func isRelevant(title : Text, description : Text) : Bool {
    let haystack = (title # " " # description).toLower();

    let hasCountry = haystack.contains(#text "iran") or
      haystack.contains(#text "israel") or
      haystack.contains(#text "united states") or
      haystack.contains(#text " us ") or
      haystack.contains(#text "u.s.");

    let hasConflict = haystack.contains(#text "conflict") or
      haystack.contains(#text "war") or
      haystack.contains(#text "airstrike") or
      haystack.contains(#text "military") or
      haystack.contains(#text "missile") or
      haystack.contains(#text "attack");

    hasCountry and hasConflict;
  };

  func compareByPublishedAtDesc(a : Article, b : Article) : Order.Order {
    Int.compare(b.publishedAtUnix, a.publishedAtUnix);
  };

  public shared ({ caller }) func setApiKey(key : Text) : async () {
    apiKey := key;
  };

  public query ({ caller }) func getLatestArticles() : async [Article] {
    let filtered = articles.filter(
      func(a) {
        isFresh(a.publishedAtUnix) and isRelevant(a.title, a.description);
      }
    );

    let sorted = filtered.sort(
      compareByPublishedAtDesc
    );

    let size = sorted.size();
    let maxSize = Nat.min(20, size);

    sorted.sliceToArray(0, maxSize);
  };

  public query ({ caller }) func searchArticles(term : Text) : async [Article] {
    if (term.size() == 0) {
      Runtime.trap("Search term cannot be empty. Example requests: \"Iran nuclear\", \"Sanctions\", \"Middle East\", \"Nuclear diplomacy\", \"Israel airstrike\".");
    };
    let loweredTerm = term.toLower();

    let filtered = articles.filter(
      func(a) {
        isFresh(a.publishedAtUnix) and
        isRelevant(a.title, a.description) and (
          a.title.toLower().contains(#text loweredTerm) or
          a.description.toLower().contains(#text loweredTerm)
        );
      }
    );

    filtered.sort(
      compareByPublishedAtDesc
    );
  };

  public query ({ caller }) func getLastFetchedAt() : async Int {
    lastFetchedAt;
  };
};
