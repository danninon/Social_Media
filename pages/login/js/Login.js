class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSwitchLoginSignUp = this.handleSwitchLoginSignUp.bind(this);
    this.state = { name: '', email: '', password: '', checkbox: 'signup' };
  }

  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'form',
        { onSubmit: this.handleSubmit },
        React.createElement(
          'li',
          null,
          'Current state: ' + this.state.checkbox,
          React.createElement(
            'label',
            { className: 'switch' },
            React.createElement('input', {
              type: 'checkbox',
              name: 'checkbox',
              placeholder: 'checkbox',
              value: this.state.checkbox,
              onClick: this.handleSwitchLoginSignUp
            }),
            React.createElement('span', { className: 'slider round' })
          )
        ),
        React.createElement(
          'li',
          { className: this.state.checkbox == "signup" ? "visible" : "transparent" },
          'Name:',
          React.createElement('input', {
            type: 'name',
            name: 'name',
            placeholder: 'name',
            value: this.state.name ? this.state.name : "",
            onChange: this.handleChange,
            required: this.state.checkbox == 'signup'
          })
        ),
        React.createElement(
          'li',
          null,
          'Email:',
          React.createElement('input', {
            type: 'email',
            name: 'email',
            placeholder: 'Email',
            value: this.state.email,
            onChange: this.handleChange,
            required: true
          })
        ),
        React.createElement(
          'li',
          null,
          'Password:',
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
          { className: 'SubmitButton', type: 'submit', required: true },
          'Submit'
        )
      )
    );
  }

  async handleSwitchLoginSignUp(event) {
    this.state.checkbox == 'login' ? this.setState({ checkbox: 'signup' }) : this.setState({ checkbox: 'login' });
  }

  async handleSubmit(event) {

    let response;
    try {
      const { name, email, password } = this.state;
      if (this.state.checkbox == 'signup') {
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