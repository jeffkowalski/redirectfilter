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

    // select previous account preference
    let prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
    prefs = prefs.getBranch("extensions.redirectfilter.");
    try {
        document.getElementById("mlistAccount").selectedItem = document.getElementById(prefs.getCharPref("account"));
    } catch (e) {}
}
