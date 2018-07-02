import React from 'react';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: '',
      loginMess: '',
    }
  }

  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value})
  }

  onSubmitSignIn = () => {
      this.props.onLoadChange(true);
    fetch('https://services.eyeq.tech/back/signin', {
      method: 'get',
      headers: {'Authorization': "Basic " + btoa(this.state.signInEmail + ":" + this.state.signInPassword)},
    })
      .then(response => response.json())
      .then(user => {
        if (user && user.token) {
          this.props.loadUser(user)
          this.props.onRouteChange('home');
        }
        else if (user && user.errmess){
            this.setState({loginMess: user.errmess})
        }
        this.props.onLoadChange(false);
      })
      .catch(err =>{
          this.props.onLoadChange(false);
          this.setState({loginMess: 'Server error...'})
          console.log(err);
      })
  }

  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="br3 ba b--black-10 bg-white-80 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80 br3">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <hr/>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input
                  className="pa2 input-reset ba bg-near-white hover-bg-light-gray w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input
                  className="b pa2 input-reset ba bg-near-white hover-bg-light-gray w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="mt2">
                <div className="b red mb2">{this.state.loginMess}</div>
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
            <div className="lh-copy mt3">
              <p  onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Signin;
