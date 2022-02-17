const DELETED = 'deleted';
const ACTIVE = 'active';
const CREATED = 'created';
const SUSPENDED = 'suspended';
class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = { id: "", status: ACTIVE };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    //initial fetch
    async componentDidMount() {}

    //when fetch send authenticate!


    //should filter by time


    render() {
        return React.createElement(
            'div',
            null,
            React.createElement(ToolBar, { className: 'ToolBar' }),
            React.createElement(
                'div',
                { className: 'adminOptions' },
                'Admin Options',
                React.createElement(
                    'form',
                    { className: 'changeStatus', onSubmit: this.handleSubmit },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'label',
                            { htmlFor: 'password' },
                            React.createElement(
                                'strong',
                                null,
                                'UserId:'
                            )
                        ),
                        React.createElement('input', {
                            type: 'id',
                            name: 'id',
                            placeholder: 'id',
                            value: this.state.id,
                            onChange: this.handleChange,
                            required: true
                        })
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'label',
                            null,
                            'New status:'
                        ),
                        React.createElement(
                            'select',
                            { name: 'status', id: 'statusSelect', required: true, value: this.state.status, onChange: this.handleChange },
                            React.createElement(
                                'option',
                                { value: 'active' },
                                'Active'
                            ),
                            React.createElement(
                                'option',
                                { value: 'suspended' },
                                'Suspended'
                            ),
                            React.createElement(
                                'option',
                                { value: 'deleted' },
                                'Deleted'
                            )
                        )
                    ),
                    React.createElement(
                        'button',
                        { type: 'submit', className: 'button' },
                        'Change Status'
                    )
                )
            )
        );
    }

    // /approveUser
    // /suspend/:id
    // /unsuspend/:id
    // /deleteUser/:id


    async handleSubmit(event) {

        try {
            let fetch_url = '/api/admin';
            let body = { id: this.state.id, status: this.state.status };
            let method;
            let headers = {
                'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken'),
                'Content-Type': 'application/json' };

            switch (this.state.status) {
                case ACTIVE:
                    fetch_url += '/approveUser';
                    method = 'POST';
                    break;
                case SUSPENDED:
                    fetch_url = fetch_url + '/suspend/' + this.state.id;
                    method = 'POST';

                    break;
                case DELETED:
                    fetch_url = fetch_url + '/deleteUser/' + this.state.id;
                    method = 'DELETE';
                    break;
                default:
                    throw new error(this.state.status + " is not an option");
                    break;
            }
            response = await fetch(fetch_url, { method: method,
                body: JSON.stringify(body),
                headers: headers });

            if (response.status == 200) {} else {
                const err = await response.text();
                alert(err);
            }
        } catch (e) {
            window.alert(response.text);
        }
    }

    async handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
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