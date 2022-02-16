class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSwitchLoginSignUp = this.handleSwitchLoginSignUp.bind(this);
    this.state = { name: '', email: '', password: '', checkbox: 'signup' };
  }

  render() {
    return <div>
      <form className="main-block" onSubmit={this.handleSubmit}>
        <h1>Authentication Form</h1>

        <hr></hr>
        <div className="formcontainer">

          <div className="account-type">
            <input type="radio" value="none" id="radioOne" name="account" checked="" onChange={this.handleSwitchLoginSignUp}></input>
            <label htmlFor="radioOne" className="radio">Login</label>
            <input type="radio" value="none" id="radioTwo" name="account" onChange={this.handleSwitchLoginSignUp}></input>
            <label htmlFor="radioTwo" className="radio">Signup</label>
          </div>

          <hr></hr>

          <div className={(this.state.checkbox == "signup") ? "visible container" : "transparent container"}>

            <label htmlFor="username"><strong>Username</strong></label>
            <input
              type="name"
              name="name"
              placeholder="name"
              value={this.state.name ? this.state.name : ""}
              onChange={this.handleChange}
              required={this.state.checkbox == 'signup'}
            />
          </div>

          <hr></hr>

          <div className="container">
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
          </div>

          <hr></hr>

          <div>
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
          </div>

          <button className="button" type="submit" required>Submit</button>
        </div>
      </form>
    </div>
  }

  async handleSwitchLoginSignUp(event) {
    this.state.checkbox == 'login' ? this.setState({ checkbox: 'signup' }) : this.setState({ checkbox: 'login' });
  }

  async handleSubmit(event) {

    let response;
    try {
      const { name, email, password } = this.state;
      if (this.state.checkbox == 'signup') {
        response = await fetch('/api/users/signup/',
          {
            method: 'POST',
            body: JSON.stringify({ name: name, email: email, password: password }),
            headers: { 'Content-Type': 'application/json' }

          });
        if (response.status == 200) { //works
          console.log("Signup successful, a request was sent to an admin!");
          window.alert("Signup successful, a request was sent to an admin!");
        }
      } else {

        response = await fetch('/api/users/login/',
          {
            method: 'POST',
            body: JSON.stringify({ email: email, password: password }),
            headers: { 'Content-Type': 'application/json' }

          })

        if (response.status == 200) {
          // window.alert("login successful, attempting to redirect to index.html");
          const data = await response.json();
          window.location.href = '/main/main.html?accessToken=' + data.accessToken;

        }

      };
    } catch (e) {
      window.alert(response.text);
    }
  }

  async handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
};
