# react-aliyun-captcha

> A ALiYun Captcha component for React

## Installation

```bash
$ npm install --save react-aliyun-captcha
```

## Usage

``` react
import ALiYunCaptcha from 'react-aliyun-captcha';

export default () => {
  const onCallback = result => console.log(result);

  return (
    <ALiYunCaptcha
      appKey="your-appKey"
      scene="your-scene"
      onCallback={onCallback}
    />
  );
};
```

## Properties

``` javascript
  className:    PropTypes.string,
  cdn:          PropTypes.string,
  appKey:       PropTypes.string.isRequired,
  scene:        PropTypes.string.isRequired,
  width:        PropTypes.number,
  trans:        PropTypes.object,
  elementID:    PropTypes.array,
  isOpt:        PropTypes.number,
  language:     PropTypes.string,
  enabled:      PropTypes.bool,
  timeout:      PropTypes.number,
  times:        PropTypes.number,
  apiMap:       PropTypes.object,
  onCallback:   PropTypes.func,
  onReady:      PropTypes.func,
```

[Read More](https://help.aliyun.com/document_detail/121963.html)

## License

MIT
