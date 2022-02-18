class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.handleSwitchLoginSignUp = this.handleSwitchLoginSignUp.bind(this);
    this.state = { name: '', email: '', password: '', authentication: 'signup' };
  }

  render() {
    return <div>
      <form className="main-block" onSubmit={this.handleSubmit}>
        <h1>Authentication Form</h1>

        <hr></hr>
        <div className="formcontainer">

          <div className="authentication-type" onChange={this.handleChange} value={this.state.authentication} required >
            <input type="radio" value="login" name="authentication" /> Login
            <input type="radio" value="signup" name="authentication" />Sign-Up
          </div>
          {/* 
            <input type="radio" value={this.authentication == 'login'} id="login" name="login" checked="" onChange={this.handleChange} required></input>
            <label htmlFor="login" className="radio">Login</label>
            <input type="radio" value={this.authentication == 'signup'} id="signup" name="signup" checked="" onChange={this.handleChange} required></input>
            <label htmlFor="signup" className="radio">Signup</label>
            */}


          <hr></hr>

          <div className={(this.state.authentication == "signup") ? "visible container" : "transparent container"}>

            <label htmlFor="username"><strong>Username</strong></label>
            <input
              type="name"
              name="name"
              placeholder="name"
              value={this.state.name}
              onChange={this.handleChange}
              required={this.state.authentication == 'signup'}
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

  // async handleSwitchLoginSignUp(event) {


  //   this.setState({ authentication: event.target })


  //   // if (this.state.authentication == 'login'){
  //   //   if (event.target != 'login'){
  //   //     this.setState({ authentication: 'login' });
  //   //   }
  //   // }
  //   // else{
  //   //   if (event.target != 'signup'){
  //   //     this.setState({ authentication: 'signup' });
  //   //   }
  //   // }
  // }

  async handleSubmit(event) {

    let response;
    try {
      const { name, email, password } = this.state;
      if (this.state.authentication == 'signup') {
        response = await fetch('/api/users/signup/',
          {
            method: 'POST',
            body: JSON.stringify({ name: name, email: email, password: password }),
            headers: { 'Content-Type': 'application/json' }

          });
        if (response.status == 200) { //works
          console.log("Signup successful, a request was sent to an admin!");
          window.alert("Signup successful, a request was sent to an admin!");
        } else if (response.status == 403) {
          sessionStorage.removeItem('accessToken');
          window.location.href = '/login/login.html';
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

        } else if (response.status == 403) {
          sessionStorage.removeItem('accessToken');
          window.location.href = '/login/login.html';
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
