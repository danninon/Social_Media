
class Main extends React.Component {
  constructor(props) {
    super(props);
    const accessToken = new URLSearchParams(window.location.search).get('accessToken')
    this.state = { 
      accessToken: accessToken,
      loggedUser: ""
    };
    if (!sessionStorage.getItem(accessToken)){
      sessionStorage.setItem("accessToken", this.state.accessToken);
    }
   // let data = sessionStorage.getItem('key');
   // sessionStorage.removeItem('key');
   // sessionStorage.clear();
  }
  render() {
    return <div>

    <PostsListBox classname='PostListBox' name='Posts'/>
    </div>
  }
  componentWillUnmount() 
  {
    sessionStorage.clear();
  }

  async componentDidMount(){

console.log("2");
window.alert("2");
    
  }
};
