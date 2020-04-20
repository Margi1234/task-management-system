const TOKEN_KEY = "jwt";
class Auth {
  constructor() {
    this.authenticated = false;
    this.registered = false;
  }
  login(cb) {
    localStorage.setItem(TOKEN_KEY, "TestLogin");
    console.log("while checking login");
    this.authenticated = true;
    console.log(this.authenticated);
    cb();
  }
  logout(cb) {
    localStorage.removeItem(TOKEN_KEY);
    this.authenticated = false;
    cb();
  }
  register(cb) {
    this.registered = true;
    cb();
  }
  isAuthenticated() {
    if (localStorage.getItem(TOKEN_KEY)) {
      return true;
    }

    return false;
  }
  isRegistered() {
    if (this.registered) {
      return true;
    } else {
      return false;
    }
  }
}

export default new Auth();
