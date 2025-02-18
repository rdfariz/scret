import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import initStore from '../src/store/index'
import withRedux from 'next-redux-wrapper'
import { Provider } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';
import '../src/assets/app.css'

class _App extends App {
  render() {
    const { Component, pageProps, router, store } = this.props
    const { query } = router
    return (
      <React.Fragment>
        <Head>
            <title>Scret Code</title>
        </Head>
        <Provider store={store}>
          <Component {...pageProps} params={query} />
        </Provider>
      </React.Fragment>
    )
  }
}

export default withRedux(initStore)(_App)