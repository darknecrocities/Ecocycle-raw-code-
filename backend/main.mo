import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();

  // Initialize auth (first caller becomes admin, others become users)
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    // Other user metadata if needed
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    principalMap.get(userProfiles, caller);
  };

  public query func getUserProfile(user : Principal) : async ?UserProfile {
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  // Waste Logging Types
  public type WasteCategory = {
    #recyclables;
    #compostables;
    #generalWaste;
    #hazardousMaterials;
    #electronicsWaste;
  };

  public type DisposalMethod = {
    #recycling;
    #composting;
    #landfill;
    #incineration;
  };

  public type WasteLog = {
    id : Nat;
    user : Principal;
    category : WasteCategory;
    method : DisposalMethod;
    quantity : Float;
    timestamp : Time.Time;
  };

  public type EcoCoinTransaction = {
    id : Nat;
    user : Principal;
    amount : Nat;
    reason : Text;
    timestamp : Time.Time;
  };

  public type LeaderboardEntry = {
    user : Principal;
    ecoCoins : Nat;
    wasteLogged : Nat;
  };

  public type Achievement = {
    id : Nat;
    user : Principal;
    name : Text;
    description : Text;
    unlocked : Bool;
    progress : Nat;
    target : Nat;
    timestamp : Time.Time;
  };

  public type EducationalContent = {
    id : Nat;
    title : Text;
    content : Text;
    category : Text;
    timestamp : Time.Time;
  };

  public type ShareableLink = {
    id : Nat;
    user : Principal;
    type_ : Text;
    data : Text;
    timestamp : Time.Time;
  };

  public type RedemptionRequest = {
    id : Nat;
    user : Principal;
    amount : Nat;
    cryptoType : Text;
    exchangeRate : Float;
    status : Text;
    timestamp : Time.Time;
  };

  // Gemini API Key Management
  var defaultGeminiApiKey : Text = "AIzaSyABa_hinTbT-zYeJsjpzU5HNZb05YE8zSQ";
  var userGeminiApiKeys = principalMap.empty<Text>();

  // Get Default Gemini API Key
  public query func getDefaultGeminiApiKey() : async Text {
    defaultGeminiApiKey;
  };

  // Get User Gemini API Key
  public query ({ caller }) func getMyGeminiApiKey() : async Text {
    switch (principalMap.get(userGeminiApiKeys, caller)) {
      case (null) defaultGeminiApiKey;
      case (?key) key;
    };
  };

  // Set User Gemini API Key
  public shared ({ caller }) func setMyGeminiApiKey(apiKey : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can set Gemini API key");
    };

    userGeminiApiKeys := principalMap.put(userGeminiApiKeys, caller, apiKey);
  };

  // Remove User Gemini API Key
  public shared ({ caller }) func removeMyGeminiApiKey() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can remove Gemini API key");
    };

    userGeminiApiKeys := principalMap.delete(userGeminiApiKeys, caller);
  };

  // Waste Logging
  transient let natMap = OrderedMap.Make<Nat>(Nat.compare);
  var wasteLogs = natMap.empty<WasteLog>();
  var ecoCoinTransactions = natMap.empty<EcoCoinTransaction>();
  var leaderboard = principalMap.empty<LeaderboardEntry>();
  var achievements = natMap.empty<Achievement>();
  var educationalContent = natMap.empty<EducationalContent>();
  var shareableLinks = natMap.empty<ShareableLink>();
  var redemptionRequests = natMap.empty<RedemptionRequest>();

  var nextWasteLogId = 0;
  var nextTransactionId = 0;
  var nextAchievementId = 0;
  var nextContentId = 0;
  var nextLinkId = 0;
  var nextRedemptionId = 0;

  // Waste Logging
  public shared ({ caller }) func logWaste(category : WasteCategory, method : DisposalMethod, quantity : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can log waste");
    };

    let wasteLog : WasteLog = {
      id = nextWasteLogId;
      user = caller;
      category;
      method;
      quantity;
      timestamp = Time.now();
    };

    wasteLogs := natMap.put(wasteLogs, nextWasteLogId, wasteLog);
    nextWasteLogId += 1;

    // Calculate EcoCoin reward
    let reward = calculateEcoCoinReward(category, method, quantity);

    // Create EcoCoin transaction
    let transaction : EcoCoinTransaction = {
      id = nextTransactionId;
      user = caller;
      amount = reward;
      reason = "Waste logging reward";
      timestamp = Time.now();
    };

    ecoCoinTransactions := natMap.put(ecoCoinTransactions, nextTransactionId, transaction);
    nextTransactionId += 1;

    // Update leaderboard
    updateLeaderboard(caller, reward);

    // Update achievements
    updateAchievements(caller, category, method, quantity);
  };

  func calculateEcoCoinReward(category : WasteCategory, method : DisposalMethod, quantity : Float) : Nat {
    let baseReward : Float = switch (category) {
      case (#recyclables) 10.0;
      case (#compostables) 8.0;
      case (#generalWaste) 5.0;
      case (#hazardousMaterials) 15.0;
      case (#electronicsWaste) 20.0;
    };

    let methodMultiplier : Float = switch (method) {
      case (#recycling) 1.5;
      case (#composting) 1.3;
      case (#landfill) 1.0;
      case (#incineration) 1.2;
    };

    let reward : Float = baseReward * methodMultiplier * quantity;
    Int.abs(Float.toInt(reward));
  };

  func updateLeaderboard(user : Principal, reward : Nat) {
    let currentEntry = principalMap.get(leaderboard, user);

    let updatedEntry = switch (currentEntry) {
      case (null) {
        {
          user;
          ecoCoins = reward;
          wasteLogged = 1;
        };
      };
      case (?entry) {
        {
          user;
          ecoCoins = entry.ecoCoins + reward;
          wasteLogged = entry.wasteLogged + 1;
        };
      };
    };

    leaderboard := principalMap.put(leaderboard, user, updatedEntry);
  };

  func updateAchievements(user : Principal, category : WasteCategory, method : DisposalMethod, quantity : Float) {
    // Update total waste logged achievement
    updateAchievementProgress(user, "Total Waste Logged", Int.abs(Float.toInt(quantity)));

    // Update category-specific achievements
    let categoryName = switch (category) {
      case (#recyclables) "Recyclables";
      case (#compostables) "Compostables";
      case (#generalWaste) "General Waste";
      case (#hazardousMaterials) "Hazardous Materials";
      case (#electronicsWaste) "Electronics Waste";
    };
    updateAchievementProgress(user, "Category: " # categoryName, Int.abs(Float.toInt(quantity)));

    // Update method-specific achievements
    let methodName = switch (method) {
      case (#recycling) "Recycling";
      case (#composting) "Composting";
      case (#landfill) "Landfill";
      case (#incineration) "Incineration";
    };
    updateAchievementProgress(user, "Method: " # methodName, Int.abs(Float.toInt(quantity)));
  };

  func updateAchievementProgress(user : Principal, name : Text, progress : Nat) {
    let filteredAchievements = Iter.filter(
      natMap.vals(achievements),
      func(a : Achievement) : Bool {
        a.user == user and a.name == name
      },
    );

    let existingAchievement = filteredAchievements.next();

    let target = switch (name) {
      case ("Total Waste Logged") 100;
      case ("Category: Recyclables") 50;
      case ("Category: Compostables") 40;
      case ("Category: General Waste") 30;
      case ("Category: Hazardous Materials") 20;
      case ("Category: Electronics Waste") 25;
      case ("Method: Recycling") 60;
      case ("Method: Composting") 50;
      case ("Method: Landfill") 30;
      case ("Method: Incineration") 20;
      case (_) 10;
    };

    let updatedAchievement = switch (existingAchievement) {
      case (null) {
        {
          id = nextAchievementId;
          user;
          name;
          description = "Achievement for " # name;
          unlocked = progress >= target;
          progress;
          target;
          timestamp = Time.now();
        };
      };
      case (?achievement) {
        {
          achievement with
          progress = achievement.progress + progress;
          unlocked = (achievement.progress + progress) >= target;
          timestamp = Time.now();
        };
      };
    };

    achievements := natMap.put(achievements, nextAchievementId, updatedAchievement);
    nextAchievementId += 1;
  };

  // Get Waste Logs
  public query ({ caller }) func getMyWasteLogs() : async [WasteLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view waste logs");
    };

    Iter.toArray(
      Iter.filter(
        natMap.vals(wasteLogs),
        func(log : WasteLog) : Bool {
          log.user == caller;
        },
      )
    );
  };

  // Get EcoCoin Balance
  public query ({ caller }) func getMyEcoCoinBalance() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view EcoCoin balance");
    };

    switch (principalMap.get(leaderboard, caller)) {
      case (null) 0;
      case (?entry) entry.ecoCoins;
    };
  };

  // Get Leaderboard
  public query func getLeaderboard() : async [LeaderboardEntry] {
    let entries = Iter.toArray(principalMap.vals(leaderboard));
    entries;
  };

  // Get Analytics Data
  public query ({ caller }) func getMyAnalytics() : async {
    totalWaste : Float;
    categoryBreakdown : [(WasteCategory, Float)];
    methodBreakdown : [(DisposalMethod, Float)];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view analytics");
    };

    let userLogs = Iter.toArray(
      Iter.filter(
        natMap.vals(wasteLogs),
        func(log : WasteLog) : Bool {
          log.user == caller;
        },
      )
    );

    var totalWaste : Float = 0.0;
    var recyclables : Float = 0.0;
    var compostables : Float = 0.0;
    var generalWaste : Float = 0.0;
    var hazardousMaterials : Float = 0.0;
    var electronicsWaste : Float = 0.0;

    var recycling : Float = 0.0;
    var composting : Float = 0.0;
    var landfill : Float = 0.0;
    var incineration : Float = 0.0;

    for (log in userLogs.vals()) {
      totalWaste += log.quantity;

      switch (log.category) {
        case (#recyclables) recyclables += log.quantity;
        case (#compostables) compostables += log.quantity;
        case (#generalWaste) generalWaste += log.quantity;
        case (#hazardousMaterials) hazardousMaterials += log.quantity;
        case (#electronicsWaste) electronicsWaste += log.quantity;
      };

      switch (log.method) {
        case (#recycling) recycling += log.quantity;
        case (#composting) composting += log.quantity;
        case (#landfill) landfill += log.quantity;
        case (#incineration) incineration += log.quantity;
      };
    };

    {
      totalWaste;
      categoryBreakdown = [
        (#recyclables, recyclables),
        (#compostables, compostables),
        (#generalWaste, generalWaste),
        (#hazardousMaterials, hazardousMaterials),
        (#electronicsWaste, electronicsWaste),
      ];
      methodBreakdown = [
        (#recycling, recycling),
        (#composting, composting),
        (#landfill, landfill),
        (#incineration, incineration),
      ];
    };
  };

  // Get Achievements
  public query ({ caller }) func getMyAchievements() : async [Achievement] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view achievements");
    };

    Iter.toArray(
      Iter.filter(
        natMap.vals(achievements),
        func(a : Achievement) : Bool {
          a.user == caller;
        },
      )
    );
  };

  // Get Educational Content
  public query func getEducationalContent() : async [EducationalContent] {
    Iter.toArray(natMap.vals(educationalContent));
  };

  // Add Educational Content (Admin Only)
  public shared ({ caller }) func addEducationalContent(title : Text, content : Text, category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add educational content");
    };

    let newContent : EducationalContent = {
      id = nextContentId;
      title;
      content;
      category;
      timestamp = Time.now();
    };

    educationalContent := natMap.put(educationalContent, nextContentId, newContent);
    nextContentId += 1;
  };

  // Create Shareable Link
  public shared ({ caller }) func createShareableLink(type_ : Text, data : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create shareable links");
    };

    let link : ShareableLink = {
      id = nextLinkId;
      user = caller;
      type_;
      data;
      timestamp = Time.now();
    };

    shareableLinks := natMap.put(shareableLinks, nextLinkId, link);
    nextLinkId += 1;

    // Generate shareable URL (placeholder)
    "https://ecocycle.app/share/" # Nat.toText(link.id);
  };

  // Get Shareable Link Data
  public query func getShareableLink(id : Nat) : async ?ShareableLink {
    natMap.get(shareableLinks, id);
  };

  // Create Redemption Request
  public shared ({ caller }) func createRedemptionRequest(amount : Nat, cryptoType : Text, exchangeRate : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create redemption requests");
    };

    let currentBalance = switch (principalMap.get(leaderboard, caller)) {
      case (null) 0;
      case (?entry) entry.ecoCoins;
    };

    if (amount > currentBalance) {
      Debug.trap("Insufficient balance for redemption");
    };

    let request : RedemptionRequest = {
      id = nextRedemptionId;
      user = caller;
      amount;
      cryptoType;
      exchangeRate;
      status = "pending";
      timestamp = Time.now();
    };

    redemptionRequests := natMap.put(redemptionRequests, nextRedemptionId, request);
    nextRedemptionId += 1;

    // Deduct EcoCoins from user's balance
    let currentEntry = principalMap.get(leaderboard, caller);

    let updatedEntry = switch (currentEntry) {
      case (null) {
        {
          user = caller;
          ecoCoins = 0;
          wasteLogged = 0;
        };
      };
      case (?entry) {
        if (entry.ecoCoins >= amount) {
          {
            entry with ecoCoins = Nat.sub(entry.ecoCoins, amount);
          };
        } else {
          Debug.trap("Insufficient balance for redemption");
        };
      };
    };

    leaderboard := principalMap.put(leaderboard, caller, updatedEntry);
  };

  // Get My Redemption Requests
  public query ({ caller }) func getMyRedemptionRequests() : async [RedemptionRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view redemption requests");
    };

    Iter.toArray(
      Iter.filter(
        natMap.vals(redemptionRequests),
        func(r : RedemptionRequest) : Bool {
          r.user == caller;
        },
      )
    );
  };

  // Get All Redemption Requests (Admin Only)
  public query ({ caller }) func getAllRedemptionRequests() : async [RedemptionRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all redemption requests");
    };

    Iter.toArray(natMap.vals(redemptionRequests));
  };

  // Update Redemption Request Status (Admin Only)
  public shared ({ caller }) func updateRedemptionStatus(id : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update redemption status");
    };

    switch (natMap.get(redemptionRequests, id)) {
      case (null) {
        Debug.trap("Redemption request not found");
      };
      case (?request) {
        let updatedRequest = { request with status };
        redemptionRequests := natMap.put(redemptionRequests, id, updatedRequest);
      };
    };
  };
};

