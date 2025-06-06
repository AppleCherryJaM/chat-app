import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage({registration, signin, setIsLoggedIn}) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isLogin, setIsLogin] = useState(true); // режим: true — вход, false — регистрация

  const validate = () => {
    const newErrors = {};

    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Incorrect email';
    }

    if (!form.password || form.password.length < 4 || form.password.length > 16) {
      newErrors.password = 'Passwords length should be 4-16 symbols';
    }

    if (!isLogin) {
      if (!form.firstName) {
        newErrors.firstName = 'Enter first name';
      }
      if (!form.lastName) {
        newErrors.lastName = 'Enter last name';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isLogin) {
      console.log('Enter:', { email: form.email, password: form.password });
    } else {
      console.log('Registration:', form);
    }
  };

	const handleSignIn = async () => {
		const res = await signin(form);
		console.log(res);
		if (res.status === 200) {
			setIsLoggedIn(true);
		}
	} 

	const handleSignUp = async () => {
		const res = await registration(form);
		console.log(res);
		if (res.status === 201) {
			setIsLoggedIn(true);
		}
	}

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>

        {!isLogin && (
          <>
            <div className="form-group">
              <label>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} />
              {errors.firstName && <p className="error">{errors.firstName}</p>}
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} />
              {errors.lastName && <p className="error">{errors.lastName}</p>}
            </div>
          </>
        )}

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button type="submit" onClick={isLogin ? handleSignIn : handleSignUp}>{isLogin ? 'Sign In' : 'Sign Up'}</button>

        <p className="switch-mode">
          {isLogin ? 'No account?' : 'Already have account?'}{' '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
