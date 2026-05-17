var Favorites = (function () {
  var favIds = [];
  var currentUser = null;
  var listeners = [];
  var db = null;

  function notify() {
    for (var i = 0; i < listeners.length; i++) listeners[i](favIds.slice());
  }

  function loadFromServer() {
    if (!db || !currentUser) { favIds = []; notify(); return; }
    db.collection('favorites').doc(currentUser.uid).get()
      .then(function (doc) {
        favIds = doc.exists && doc.data().recipeIds ? doc.data().recipeIds.slice() : [];
        notify();
      })
      .catch(function () { favIds = []; notify(); });
  }

  function init(authInstance) {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      try { db = firebase.firestore(); } catch (e) { return; }
    } else {
      return;
    }
    authInstance.onAuthStateChanged(function (user) {
      currentUser = user;
      if (user) loadFromServer();
      else { favIds = []; notify(); }
    });
  }

  function toggleFavorite(recipeId) {
    if (!db || !currentUser) return Promise.resolve(false);
    var idx = favIds.indexOf(recipeId);
    if (idx > -1) {
      favIds.splice(idx, 1);
      return db.collection('favorites').doc(currentUser.uid).set({ recipeIds: favIds.slice() }, { merge: true })
        .then(function () { notify(); return false; });
    } else {
      favIds.push(recipeId);
      return db.collection('favorites').doc(currentUser.uid).set({ recipeIds: favIds.slice() }, { merge: true })
        .then(function () { notify(); return true; });
    }
  }

  function isFavorite(recipeId) {
    return favIds.indexOf(recipeId) > -1;
  }

  function getFavorites() {
    return favIds.slice();
  }

  function onChange(cb) {
    listeners.push(cb);
    return function () {
      listeners = listeners.filter(function (l) { return l !== cb; });
    };
  }

  return { init: init, toggle: toggleFavorite, is: isFavorite, getAll: getFavorites, onChange: onChange };
})();

if (typeof window !== 'undefined') window.Favorites = Favorites;
