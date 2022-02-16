
class Main extends React.Component {
  constructor(props) {
    super(props);
    const accessToken = new URLSearchParams(window.location.search).get('accessToken')
    this.state = { 
      accessToken: accessToken,
      loggedUser: ""
    };
    if (sessionStorage.getItem("accessToken") === null){
      if(accessToken !== null){
        sessionStorage.setItem("accessToken", accessToken);
      }else{
        //handleError
      }
    }
   // let data = sessionStorage.getItem('key');
   // sessionStorage.removeItem('key');
   // sessionStorage.clear();
  }
  render() {
    return <div>
        <ToolBar className='ToolBar' />
        <PostsListBox  classname='PostListBox' name='Posts'/> 

     </div>
  }
  componentWillUnmount() 
  {
    //sessionStorage.clear();
  }

  async componentDidMount(){

    // console.log("2");

    
  }
};
