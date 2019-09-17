import React from 'react';

const SCRIPT_ID = 'react-aliyun-captcha';

const typeOf = type => object => Object.prototype.toString.call(object) === `[object ${type}]`;

// const isString = typeOf('String');
// const isObject = typeOf('Object');
const isFunction = typeOf('Function');

const getRandomString = prefix =>
  `${prefix || 'random'}_${new Date().getTime()}_${Math.random()
    .toString(36)
    .substring(2)}`;

function NewCustomEvent(type, params = { bubbles: false, cancelable: false, detail: null }) {
  const event = document.createEvent('CustomEvent');
  event.initCustomEvent(type, !!params.bubbles, !!params.cancelable, params.detail || {});
  return event;
}

export default class ALiYun extends React.PureComponent {
  static defaultProps = {
    className: 'i-aliyun',
    cdn: 'cn',
    // appKey: '',
    // scene: '',
    // width: 300,
    // trans: {},
    // elementID: [],
    // isOpt: 0,
    language: 'cn',
    enabled: true,
    // timeout: 3000,
    // times: 5,
    // apiMap: ,
    // onCallback: () => {},
    // onReady: () => {},
  };

  constructor() {
    super(...arguments);

    const that = this;

    that.id = getRandomString('captcha');

    that.instance = null;
    that.script = null;

    // that.state = {};
  }

  componentDidMount() {
    const that = this;
    // console.log('componentDidMount', that.props, that.state);
    // const {  } = that.props;
    // const {  } = that.state;
    that.create();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const that = this;
  //   // console.log('shouldComponentUpdate', that.props, nextProps, that.state, nextState);
  //   const {
  //     className,
  //     appId,
  //     options,
  //   } = that.props;

  //   const isUpdate =
  //     className !== nextProps.className ||
  //     appId !== nextProps.appId ||
  //     options !== nextProps.options;

  //   return isUpdate;
  // }

  componentDidUpdate(prevProps, prevState) {
    const that = this;
    // console.log('componentDidUpdate', prevProps, that.props, prevState, that.state);
    // const {  } = that.props;
    // const {  } = that.state;
    that.create();
  }

  componentWillUnmount() {
    const that = this;
    // console.log('componentWillUnmount', that.props, that.state);
    // const {  } = that.props;
    // const {  } = that.state;
    that.destroy();
  }

  create = () => {
    const that = this;
    // console.log('create');
    const { cdn } = that.props;
    // const {  } = that.state;

    if (window.noCaptcha) {
      return that.ready();
    }

    const script = document.getElementById(SCRIPT_ID);
    if (script) {
      if (that.script) {
        return;
      }

      script.addEventListener('Im-ready', that.ready, false);
      that.script = script;
      return;
    }

    const ds = document.createElement('script');
    ds.id = SCRIPT_ID;
    ds.type = 'text/javascript';
    ds.async = true;
    ds.charset = 'utf-8';

    if (ds.readyState) {
      ds.onreadystatechange = () => {
        if (ds.readyState === 'loaded' || ds.readyState === 'complete') {
          ds.onreadystatechange = null;
          that.triggerEvent('Im-ready');
        }
      };
    } else {
      ds.onload = () => {
        ds.onload = null;
        that.triggerEvent('Im-ready');
      };
    }

    const protocol = window.location.protocol === 'http:' ? 'http:' : 'https:';
    const host = cdn !== 'cn' ? 'aeis.alicdn.com' : 'g.alicdn.com';
    ds.src = `${protocol}//${host}/sd/ncpc/nc.js?_t=${new Date().getTime()}`;

    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ds, s);

    ds.addEventListener('Im-ready', that.ready, false);
    that.script = ds;
  };

  ready = event => {
    const that = this;
    // console.log('ready');
    const {
      appKey,
      scene,
      width,
      trans,
      elementID,
      isOpt,
      language,
      enabled,
      timeout,
      times,
      apiMap,
      onCallback,
      onReady,
    } = that.props;
    // const {  } = that.state;

    if (!window.noCaptcha) {
      return;
    }

    if (that.instance) {
      // that.instance.destroy();
      return;
    }

    const options = {
      renderTo: `#${that.id}`,
      appkey: appKey,
      scene: scene,
      token: getRandomString(appKey),
      customWidth: width,
      trans,
      elementID,
      is_Opt: isOpt,
      language,
      isEnabled: enabled,
      timeout,
      times,
      apimap: apiMap,
      callback: onCallback,
    };

    // eslint-disable-next-line new-cap
    const captcha = new window.noCaptcha(options);
    that.instance = captcha;

    if (isFunction(onReady)) {
      onReady(captcha);
    }
  };

  destroy = () => {
    const that = this;
    // console.log('destroy');
    // const {  } = that.props;
    // const {  } = that.state;

    if (that.script && isFunction(that.script.removeEventListener)) {
      that.script.removeEventListener('Im-ready', that.ready, false);
      // that.script.parentNode.removeChild(that.script);
      that.script = null;
    }

    if (that.instance && isFunction(that.instance.destroy)) {
      that.instance.destroy();
      that.instance = null;
    }
  };

  triggerEvent = type => {
    const that = this;
    // console.log('triggerEvent');
    // const {  } = that.props;
    // const {  } = that.state;

    if (!that.script || !isFunction(that.script.dispatchEvent)) {
      return;
    }

    const event = isFunction(window.CustomEvent)
      ? new window.CustomEvent(type, {
          detail: null,
          bubbles: false,
          cancelable: false,
          // composed: false,
        })
      : NewCustomEvent(type, {
          detail: null,
          bubbles: false,
          cancelable: false,
          // composed: false,
        });

    that.script.dispatchEvent(event);
  };

  render() {
    const that = this;
    // console.log('render');
    const { className } = that.props;
    // const {  } = that.state;

    return <div id={that.id} className={`nc-container ${className}`} />;
  }
}
