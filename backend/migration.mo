import OrderedMap "mo:base/OrderedMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module {
  type OldActor = {
    userProfiles : OrderedMap.Map<Principal, {
      name : Text;
    }>;
    wasteLogs : OrderedMap.Map<Nat, {
      id : Nat;
      user : Principal;
      category : {
        #recyclables;
        #compostables;
        #generalWaste;
        #hazardousMaterials;
        #electronicsWaste;
      };
      method : {
        #recycling;
        #composting;
        #landfill;
        #incineration;
      };
      quantity : Float;
      timestamp : Int;
    }>;
    ecoCoinTransactions : OrderedMap.Map<Nat, {
      id : Nat;
      user : Principal;
      amount : Nat;
      reason : Text;
      timestamp : Int;
    }>;
    leaderboard : OrderedMap.Map<Principal, {
      user : Principal;
      ecoCoins : Nat;
      wasteLogged : Nat;
    }>;
    achievements : OrderedMap.Map<Nat, {
      id : Nat;
      user : Principal;
      name : Text;
      description : Text;
      unlocked : Bool;
      progress : Nat;
      target : Nat;
      timestamp : Int;
    }>;
    educationalContent : OrderedMap.Map<Nat, {
      id : Nat;
      title : Text;
      content : Text;
      category : Text;
      timestamp : Int;
    }>;
    shareableLinks : OrderedMap.Map<Nat, {
      id : Nat;
      user : Principal;
      type_ : Text;
      data : Text;
      timestamp : Int;
    }>;
    redemptionRequests : OrderedMap.Map<Nat, {
      id : Nat;
      user : Principal;
      amount : Nat;
      cryptoType : Text;
      exchangeRate : Float;
      status : Text;
      timestamp : Int;
    }>;
    nextWasteLogId : Nat;
    nextTransactionId : Nat;
    nextAchievementId : Nat;
    nextContentId : Nat;
    nextLinkId : Nat;
    nextRedemptionId : Nat;
  };

  type NewActor = {
    userProfiles : OrderedMap.Map<Principal, {
      name : Text;
    }>;
    wasteLogs : OrderedMap.Map<Nat, {
      id : Nat;
      user : Principal;
      category : {
        #recyclables;
        #compostables;
        #generalWaste;
        #hazardousMaterials;
        #electronicsWaste;
      };
      method : {
        #recycling;
        #composting;
        #landfill;
        #incineration;
      };
      quantity : Float;
      timestamp : Int;
    }>;
    ecoCoinTransactions : OrderedMap.Map<Nat, {
      id : Nat;
      user : Principal;
      amount : Nat;
      reason : Text;
      timestamp : Int;
    }>;
    leaderboard : OrderedMap.Map<Principal, {
      user : Principal;
      ecoCoins : Nat;
      wasteLogged : Nat;
    }>;
    achievements : OrderedMap.Map<Nat, {
      id : Nat;
      user : Principal;
      name : Text;
      description : Text;
      unlocked : Bool;
      progress : Nat;
      target : Nat;
      timestamp : Int;
    }>;
    educationalContent : OrderedMap.Map<Nat, {
      id : Nat;
      title : Text;
      content : Text;
      category : Text;
      timestamp : Int;
    }>;
    shareableLinks : OrderedMap.Map<Nat, {
      id : Nat;
      user : Principal;
      type_ : Text;
      data : Text;
      timestamp : Int;
    }>;
    redemptionRequests : OrderedMap.Map<Nat, {
      id : Nat;
      user : Principal;
      amount : Nat;
      cryptoType : Text;
      exchangeRate : Float;
      status : Text;
      timestamp : Int;
    }>;
    nextWasteLogId : Nat;
    nextTransactionId : Nat;
    nextAchievementId : Nat;
    nextContentId : Nat;
    nextLinkId : Nat;
    nextRedemptionId : Nat;
    defaultGeminiApiKey : Text;
    userGeminiApiKeys : OrderedMap.Map<Principal, Text>;
  };

  public func run(old : OldActor) : NewActor {
    let principalMap = OrderedMap.Make<Principal>(Principal.compare);
    {
      userProfiles = old.userProfiles;
      wasteLogs = old.wasteLogs;
      ecoCoinTransactions = old.ecoCoinTransactions;
      leaderboard = old.leaderboard;
      achievements = old.achievements;
      educationalContent = old.educationalContent;
      shareableLinks = old.shareableLinks;
      redemptionRequests = old.redemptionRequests;
      nextWasteLogId = old.nextWasteLogId;
      nextTransactionId = old.nextTransactionId;
      nextAchievementId = old.nextAchievementId;
      nextContentId = old.nextContentId;
      nextLinkId = old.nextLinkId;
      nextRedemptionId = old.nextRedemptionId;
      defaultGeminiApiKey = "AIzaSyABa_hinTbT-zYeJsjpzU5HNZb05YE8zSQ";
      userGeminiApiKeys = principalMap.empty<Text>();
    };
  };
};

