const DELETED = 'deleted';
const ACTIVE = 'active';
const CREATED = 'created';
const SUSPENDED = 'suspended';
class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = { id : "", status : ACTIVE };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    //initial fetch
    async componentDidMount() {

    }

    //when fetch send authenticate!


//should filter by time
//adminOptions should be a different component
    render() {
        return <div className = 'main-block'>
            <ToolBar className='ToolBar' />

            <h1>Admin Options</h1>    
                  
            <form className='container' onSubmit={this.handleSubmit}>                
                <h2>Send Global Message</h2>
                <div>
                    <label htmlFor="id"><strong>UserId:</strong></label>
                    <input
                        type="id"
                        name="id"
                        placeholder="id"
                        value={this.state.id}
                        onChange={this.handleChange}
                        required
                    />
                       <button type='submit' className='button'>Change Status</button>
                </div>
                
         
                
                <h2>Change User Status</h2>
                <div>
                    <h3>New status:</h3>
                    <select name="status" id="statusSelect" required value={this.state.status} onChange={this.handleChange}>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="deleted">Deleted</option>
                    </select>
                </div>
            </form>
            <MessageListBox className='container'></MessageListBox>
        </div>
 }
 
    // /approveUser
// /suspend/:id
// /unsuspend/:id
// /deleteUser/:id


    async handleSubmit(event) {
        
        try{
            let err;
       let fetch_url = '/api/admin';
       let body = {id : this.state.id, status : this.state.status};
       let method;
       let headers = { 
        'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken'),
        'Content-Type': 'application/json' };

        switch(this.state.status){
            case ACTIVE:
            fetch_url += '/approveUser'
            method = 'POST'
                break;
            case SUSPENDED:
            fetch_url = fetch_url + '/suspend/' + this.state.id;
            method = 'PUT'
           
                break;
            case DELETED:
            fetch_url = fetch_url + '/deleteUser/' + this.state.id;
            method = 'DELETE'
                break;
            default:
                throw new error(this.state.status + " is not an option");
                break;
        }
        const response = await fetch(fetch_url,
                            {method : method,
                            body : JSON.stringify(body),
                            headers : headers})

    
    	if ( response.status == 200 )
		{
            window.alert("action successful\nUser status: "+await response);
		}
		else 
		{
			throw new error(response.text());
			
		}
    }catch(e){
        window.alert(e.text)
    }
    }

    
    async handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
      }
}