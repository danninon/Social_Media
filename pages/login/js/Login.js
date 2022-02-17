class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.handleSwitchLoginSignUp = this.handleSwitchLoginSignUp.bind(this);
    this.state = { name: '', email: '', password: '', authentication: 'signup' };
  }

  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'form',
        { className: 'main-block', onSubmit: this.handleSubmit },
        React.createElement(
          'h1',
          null,
          'Authentication Form'
        ),
        React.createElement('hr', null),
        React.createElement(
          'div',
          { className: 'formcontainer' },
          React.createElement(
            'div',
            { className: 'authentication-type', onChange: this.handleChange, value: this.state.authentication, required: true },
            React.createElement('input', { type: 'radio', value: 'login', name: 'authentication' }),
            ' Login',
            React.createElement('input', { type: 'radio', value: 'signup', name: 'authentication' }),
            'Sign-Up'
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: this.state.authentication == "signup" ? "visible container" : "transparent container" },
            React.createElement(
              'label',
              { htmlFor: 'username' },
              React.createElement(
                'strong',
                null,
                'Username'
              )
            ),
            React.createElement('input', {
              type: 'name',
              name: 'name',
              placeholder: 'name',
              value: this.state.name,
              onChange: this.handleChange,
              required: this.state.authentication == 'signup'
            })
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'container' },
            React.createElement(
              'label',
              { htmlFor: 'email' },
              React.createElement(
                'strong',
                null,
                'Email'
              )
            ),
            React.createElement('input', {
              type: 'email',
              name: 'email',
              placeholder: 'Email',
              value: this.state.email,
              onChange: this.handleChange,
              required: true
            })
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'password' },
              React.createElement(
                'strong',
                null,
                'Password'
              )
            ),
            React.createElement('input', {
              type: 'password',
              name: 'password',
              placeholder: 'Password',
              value: this.state.password,
              onChange: this.handleChange,
              required: true
            })
          ),
          React.createElement(
            'button',
            { className: 'button', type: 'submit', required: true },
            'Submit'
          )
        )
      )
    );
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
        response = await fetch('/api/users/signup/', {
          method: 'POST',
          body: JSON.stringify({ name: name, email: email, password: password }),
          headers: { 'Content-Type': 'application/json' }

        });
        if (response.status == 200) {
          //works
          console.log("Signup successful, a request was sent to an admin!");
          window.alert("Signup successful, a request was sent to an admin!");
        }
      } else {

        response = await fetch('/api/users/login/', {
          method: 'POST',
          body: JSON.stringify({ email: email, password: password }),
          headers: { 'Content-Type': 'application/json' }

        });

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