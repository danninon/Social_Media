class ToolBar extends React.Component 
{	

	constructor(props) 
	{
		super(props);
        this.handle_redirect_admin = this.handle_redirect_admin.bind(this);
	    this.state = {};
	}

    //initial fetch
    async componentDidMount() 
	{

	}

	//when fetch send authenticate!
   
	
	//should filter by time


    render() { return <div className='ToolBar'>
                        <button className='button' onClick={this.handle_redirect_admin}>Admin Page</button>
                        <button className='button' onClick={this.handle_redirect_home}>Home Page</button>
                        <button className='button' onClick={this.handle_redirect_chat}>Message Page</button>
                        <button className='button' onClick={this.handle_redirect_about}>About Page</button>
                      </div>
	}


    handle_redirect_admin(){
        //if it is an admin allow this otherwise, show an error
        window.location.href = '/admin/admin.html';
    }
    handle_redirect_home() {
        //if not home already
         window.location.href = '/main/main.html';
       }
 
     handle_redirect_about(){
         //if not at about already
         window.location.href = '/about/about.html';
     }
     handle_redirect_chat(){
         //if not at chat already
        window.location.href = '/chat/chat.html';
    }
}