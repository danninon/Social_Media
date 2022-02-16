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
      <form onSubmit={this.handleSubmit}>

        <li>
          {'Current state: ' + this.state.checkbox}
          <label className="switch">
            <input
              type="checkbox"
              name="checkbox"
              placeholder="checkbox"
              value={this.state.checkbox}
              onClick={this.handleSwitchLoginSignUp}
            />
            <span className="slider round"></span>
          </label>
        </li>

        <li className={(this.state.checkbox == "signup") ? "visible" : "transparent"}>
          Name:
          <input
            type="name"
            name="name"
            placeholder="name"
            value={this.state.name ? this.state.name:""} 
            onChange={this.handleChange}
            required = {this.state.checkbox=='signup'}
          />
        </li>

        <li>
          Email:
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleChange}
            required
          />
        </li>

        <li>
          Password:
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChange}
            required
          />
        </li>

        <button className="SubmitButton" type="submit" required>Submit</button>

      </form>
    </div>
  }

  async handleSwitchLoginSignUp(event) {
    this.state.checkbox == 'login' ? this.setState({ checkbox: 'signup' }) : this.setState({ checkbox: 'login' });
  }

  async handleSubmit(event) {
   
    let response;
    try{
    const { name, email, password } = this.state;
    if (this.state.checkbox == 'signup') {
      response = await fetch('/api/users/signup/',
        {
          method: 'POST',
          body: JSON.stringify({ name: name, email: email, password: password }),
          headers: { 'Content-Type': 'application/json' }
          
        });
        if (response.status == 200){ //works
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
      
        if (response.status == 200){
         // window.alert("login successful, attempting to redirect to index.html");
          const data = await response.json();
          window.location.href = '/main/main.html?accessToken=' + data.accessToken;
          
        }
        
      };
    }catch(e)
     {
     window.alert(response.text);
     }
  }

  async handleChange(event) {
     this.setState({ [event.target.name]: event.target.value });
}};
