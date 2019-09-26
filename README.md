## About
个人博客

> 包含功能：<br/>

## Usage

```js
import { getCdpSpaceInfos,
         feedbackCdpSpace,
         SpaceBehavior,
         getBadgeSpaceInfos,
         feedbackBadgeSpace,
       } from '@alipay/cdp-unity-handle';
```

## API

### getCdpSpaceInfos

批量/单个获取投放信息方法

**Params**

* `allCodes` **{Array<String>}**: 批量请求的展位码数组
* `isImmediately` **{Bool}**: 是否直接请求服务获取最新数据
* `successBlock` **{callBack}**:  成功后执行的操作
* `failBlock` **{callBack}**: 失败后执行的操作  


**Example**
```js
getCdpSpaceInfos(['YUEBAO_ENTRY_ALIPAY', 'YUEBAO_GUIDE_ALIPAY'],
                true,
                function(result) {
                  console.log('result:' + JSON.stringfy(result));
                });
```  
  
  
### getBadgeSpaceInfos

批量/单个获取红点信息方法 支付宝60版本开始可用

**Params**

* `allCodes` **{Array<String>}**: 批量请求的展位码数组
* `isImmediately` **{Bool}**: 是否直接请求服务获取最新数据
* `widgetIDs` **{Array<String>}**: 创意内容id数组
* `successBlock` **{callBack}**:  成功后执行的操作
* `failBlock` **{callBack}**: 失败后执行的操作  

**Example**
```js
getBadgeSpaceInfos(['YEB_YOUXUAN_BADGE', 'YUEBAO_GOTOWEALTH'],
                  true,
                  function(result) {
                    console.log('result:' + JSON.stringfy(result));
                  });
```  

### SpaceBehavior

投放/红点行为枚举

**Enum**

* `SpaceBehavior.Normal` **= 0**: 正常状态
* `SpaceBehavior.SHOW` **= 1**: 曝光
* `SpaceBehavior.CLICK` **= 2**: 点击



### feedbackCdpSpace

投放行为上报

**Params**

* `action` **{SpaceBehavior}**: SpaceBehavior行为：曝光，点击
* `spaceCode` **{String}**: 展位码
* `objectId` **{String}**: 拉取投放数据得到的objectId

**Example**
```js
feedbackCdpSpace(SpaceBehavior.CLICK,
               'YUEBAO_HOME_YOUXUAN_BANNER',
                objectId);
```  

### feedbackBadgeSpace

红点行为上报

**Params**

* `action` **{SpaceBehavior}**: SpaceBehavior行为：曝光，点击
* `spaceCode` **{String}**: 展位码
* `objectId` **{String}**: 拉取投放数据得到的objectId
* `widgetId` **{String}**: 创意内容id


**Example**
```js
feedbackBadgeSpace(SpaceBehavior.SHOW,
                  'YUEBAO_HOME_YOUXUAN_BANNER',
                   objectId,
                   widgetId);
```  
