const {classes: Cc, interfaces: Ci, results: Cr, utils: Cu} = Components;

function createMenuItem(aLabel,aValue,aId) {
    const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    let item = document.createElementNS(XUL_NS, "menuitem"); // create a new XUL menuitem
    item.setAttribute("label", aLabel);
    item.setAttribute("value", aValue);
    item.setAttribute("id", aId);
    return item;
}

function onLoad() {
    // insert managed accounts into drop-down list
    let am = Cc["@mozilla.org/messenger/account-manager;1"].getService(Ci.nsIMsgAccountManager);
    let menupopupAccounts = document.getElementById("menupopupAccounts");
    for (let i = 0; i < am.accounts.length; i++) {
        let amacc = am.accounts.queryElementAt(i, Ci.nsIMsgAccount);
        try {
            let newItem = createMenuItem(amacc.defaultIdentity.identityName, amacc.key, amacc.key);
            menupopupAccounts.appendChild(newItem);
        } catch (e) {}
    }

    // Load preferences or set default
    //   local preferences in jsonPrefs
    let rootHbox = window.arguments[0];
    let jsonPrefs;
    try {
        jsonPrefs = JSON.parse(rootHbox.getAttribute("value"));
    } catch (e) {
        try {
            jsonPrefs = JSON.parse(rootHbox.value);
        } catch (e) {
            jsonPrefs = new Array();
        }
    }

    //   default preferences in prefs
    let prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
    prefs = prefs.getBranch("extensions.redirectfilter.");

    try {
        document.getElementById("checkKeepOriginalDate").setAttribute("checked", (typeof(jsonPrefs.keepOriginalDate) == "undefined") ? prefs.getBoolPref("keepOriginalDate.enabled") : jsonPrefs.keepOriginalDate);
    } catch (e) {}
    try {
        document.getElementById("checkRedirectCCHeader").setAttribute("checked", (typeof(jsonPrefs.redirectCCHeader) == "undefined") ? prefs.getBoolPref("redirectCCHeader.enabled") : jsonPrefs.redirectCCHeader);
    } catch (e) {}
    try {
        document.getElementById("checkRedirectToHeader").setAttribute("checked", (typeof(jsonPrefs.redirectToHeader) == "undefined") ? prefs.getBoolPref("redirectToHeader.enabled") : jsonPrefs.redirectToHeader);
    } catch (e) {}
    try {
        document.getElementById("checkRedirectSequencesHeaders").setAttribute("checked", (typeof(jsonPrefs.redirectSequencesHeaders) == "undefined") ? prefs.getBoolPref("redirectSequencesHeaders.enabled") : jsonPrefs.redirectSequencesHeaders);
    } catch (e) {}
    try {
        document.getElementById("checkCopyToSent").setAttribute("checked", (typeof(jsonPrefs.copyToSent) == "undefined") ? prefs.getBoolPref("copyToSent.enabled") : jsonPrefs.copyToSent);
    } catch (e) {}
    try {
        document.getElementById("checkMarkAsForwarded").setAttribute("checked", (typeof(jsonPrefs.markAsForwarded) == "undefined") ? prefs.getBoolPref("markAsForwarded.enabled") : jsonPrefs.markAsForwarded);
    } catch (e) {}
    try {
        document.getElementById("mlistAccount").selectedItem = document.getElementById(((typeof(jsonPrefs.account) == "undefined") ? prefs.getCharPref("account") : jsonPrefs.account));
    } catch (e) {}
    try {
        document.getElementById("checkChangeReplyToHeader").setAttribute("checked", (typeof(jsonPrefs.changeReplyToHeader) == "undefined") ? prefs.getBoolPref("changeReplyToHeader.enabled") : jsonPrefs.changeReplyToHeader);
    } catch (e) {}
    try {
        document.getElementById("textNewReplyToHeader").value = (typeof(jsonPrefs.newReplyToHeader) == "undefined") ? prefs.getComplexValue("newReplyToHeader",Ci.nsISupportsString).data : jsonPrefs.newReplyToHeader; // read utf8 string preference
    } catch (e) {}/**/
}

function onAccept() {
    let jsonPrefs = new Object();
    try {
        jsonPrefs.keepOriginalDate = document.getElementById("checkKeepOriginalDate").getAttribute("checked");
    } catch (e) {}
    try {
        jsonPrefs.redirectCCHeader = document.getElementById("checkRedirectCCHeader").getAttribute("checked");
    } catch (e) {}
    try {
        jsonPrefs.redirectToHeader = document.getElementById("checkRedirectToHeader").getAttribute("checked");
    } catch (e) {}
    try {
        jsonPrefs.redirectSequencesHeaders = document.getElementById("checkRedirectSequencesHeaders").getAttribute("checked");
    } catch (e) {}
    try {
        jsonPrefs.copyToSent = document.getElementById("checkCopyToSent").getAttribute("checked");
    } catch (e) {}
    try {
        jsonPrefs.markAsForwarded = document.getElementById("checkMarkAsForwarded").getAttribute("checked");
    } catch (e) {}
    try {
        jsonPrefs.account = document.getElementById("mlistAccount").selectedItem.value;
    } catch (e) {}
    try {
        jsonPrefs.changeReplyToHeader = document.getElementById("checkChangeReplyToHeader").getAttribute("checked");
    } catch (e) {}
    try {
        jsonPrefs.newReplyToHeader = document.getElementById("textNewReplyToHeader").value;
    } catch (e) {}

    // save local preferences
    let rootHbox = window.arguments[0];
    jsonPrefs.redirectTo = rootHbox.firstChild.value;
    let rawValue = JSON.stringify(jsonPrefs);
    try {
        rootHbox.setAttribute("value", rawValue);
    } catch (e) {}
    try {
        rootHbox.value = rawValue;/**/
    } catch (e) {}

    return true;
}
