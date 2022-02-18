class About extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  //initial fetch
  async componentDidMount() {}

  // async showFile(e)  {
  //     e.preventDefault()
  //     const reader = new FileReader()
  //     reader.onload = async (e) => { 
  //       const text = (e.target.result)
  //       console.log(text)
  //       alert(text)
  //     };
  //     reader.readAsText(e.target.files[0])
  //   }
  //  <input type="file" target="/readme.txt" onChange={(e) => this.showFile(e)} />


  render() {
    return React.createElement(
      'div',
      { className: 'main-block' },
      React.createElement(ToolBar, { className: 'ToolBar' }),
      React.createElement(
        'div',
        { className: 'container ' },
        React.createElement(
          'h1',
          null,
          'About'
        ),
        React.createElement('embed', { src: 'readme.txt' })
      )
    );
  }
}
class ToolBar extends React.Component {

  constructor(props) {
      super(props);
      this.handle_redirect_admin = this.handle_redirect_admin.bind(this);
      this.state = {};
  }

  //initial fetch
  async componentDidMount() {}

  //when fetch send authenticate!


  //should filter by time


  render() {
      return React.createElement(
          'div',
          { className: 'ToolBar' },
          React.createElement(
              'button',
              { className: 'button', onClick: this.handle_redirect_admin },
              'Admin Page'
          ),
          React.createElement(
              'button',
              { className: 'button', onClick: this.handle_redirect_home },
              'Home Page'
          ),
          React.createElement(
              'button',
              { className: 'button', onClick: this.handle_redirect_chat },
              'Message Page'
          ),
          React.createElement(
              'button',
              { className: 'button', onClick: this.handle_redirect_about },
              'About Page'
          )
      );
  }

  handle_redirect_admin() {
      //if it is an admin allow this otherwise, show an error
      window.location.href = '/admin/admin.html';
  }
  handle_redirect_home() {
      //if not home already
      window.location.href = '/main/main.html';
  }

  handle_redirect_about() {
      //if not at about already
      window.location.href = '/about/about.html';
  }
  handle_redirect_chat() {
      //if not at chat already
      window.location.href = '/chat/chat.html';
  }
}