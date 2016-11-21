# 基础
--------------------------------------------
## 转换至可观察对象

```javascript
// From one or multiple values
Rx.Observable.of('foo', 'bar');

// From array of values
Rx.Observable.from([1,2,3]);

// From a event
Rx.Observable.fromEvent(document.querySelector('button'), 'click');

// From a Promise
Rx.Observable.fromPromise(fetch('/users'));

// From a callback (last argument is a callback)
//fs.exists(path, cb(exists))
var exists = Rx.Observable.bindCallback(fs.exists);
exists('file.txt').subscribe(exists => console.log('Does file exist?', exists));

// From a node callback (last argument is a callback)
// fs.rename(pathA, pathB, cb(err, result))
var rename = Rx.Observable.bindNodeCallback(fs.rename);
rename('file.txt', 'else.txt').subscribe(() => console.log('Renamed!'));
```

## 创建可观察对象
> 创建新的外部事件

```javascript
var myObservable = new Rx.Subject();
myObservable.subscribe(value => console.log(value));
myObservable.next('foo');
```
> 创建新的内部事件

```javascript
var myObversable = Rx.Observable.create(observer => {
	observer.next('foo');
	setTimeout(() => observer.next('bar'), 1000);
});
myObservable.subscribe(value => console.log(value));
```
使用哪一个方法取决于你的使用场景。如果你要封装一个根据时间生成值的函数，那么Observable更合适，比如一个websocket链接。使用Subject，你可以随时随地更具需要触发事件，并且将一个存在可观察对象连接起来。

## 控制事件流
```javascript
// 测例子输入 'hello world'
var input = Rx.Observable.fromEvent(document.querySelector('input'), 'keyup');

// 过滤掉输入字符长度小于3的事件
input.filter(event => event.target.value.length > 2).subscribe(event => console.log(event.target.value));

// 事件推迟200ms
input.delay(200).subscribe(event => console.log(event.target.value));

// 每200ms事件发生一次
input.throttleTime(200).subscribe(event => console.log(event.target.value));

// 每200ms最多只发生一次事件
input.debounceTime(200).subscribe(event => console.log(event.target.value));

// 接收3次事件后停止接收事件
input.take(3).subscribe(event => console.log(event.target.value));

// 当停止事件发生后不再接收事件
var stopStream = Rx.Observable.fromEvent(document.querySelector('button'), 'click');
input.takeUntil(stopStream).subscribe(event => console.log(event.target.value));
```

## 值的处理
```javascript
// 输入'hello world'
var input = Rx.Observable.fromEvent(document.querySelector('input'), 'keyup');

// 传递一个新值
input.map(event => event.target.value).subscribe(value => console.log(value));

// 将值取出并传递
input.pluck('target', 'value').subscribe(value => console.loog(value));

// 返回之前和当前的值
input.pluck('target', 'value').pariwise().subscribe(value => console.log(value));

// 仅返回不重复的值
input.distinct(event => event.key).pluck('target', 'value').subscribe(value => console.log(value)); // 'helo wrd'

// 只传不连续的值
input.distinctUntilChannged((pre, cur) => pre.key === cur.key).pluck('target', 'value').subscribe(value => console.log(value)); // 'helo world'
```

# 创建应用
----------------------------------------------------
> RxJS是一个很棒的工具，使用无状态函数，使你的代码更加健壮。但是我们的应用是有状态的，那无状态的RxJS和有状态的应用是怎么联系起来的？
> 让我们建立一个简单应用存储值为0，然后每点击一次，值加1.

```javascript
var button = document.querySelector('button');
Rx.Observable.fromEvent(button, 'click')
	.scan(count => count + 1, 0)
	.subscribe(count => document.querySelector('#count').innerHTML = count);
```

## 状态存储
> 应用使用state stores存储状态。不同的框架有不同的叫法：store, reducer, model，但是核心之处它们都是一个对象。而我们还需要处理的是多个可观察对象更新同一个state store。

```javascript
var increaseButton = document.querySelector('#increase');
var increase = Rx.Observable.fromEvent(increaseButton, 'click')
  // 当递增事件发生时，返回一个可以state.count+1的函数
  .map(() => state => Object.assign({}, state, {count: state.count + 1}));

var decreaseButton = document.querySelector('#decrease');
var decrease = Rx.Observable.fromEvent(decreaseButton, 'click')
  // 当递减事件发生时，返回一个可以state.count-1的函数
  .map(() => state => Object.assign({}, state, {count: state.count - 1}));

var inputElement = document.querySelector('#input');
var input = Rx.Observable.fromEvent(inputElement, 'keypress')
  // 输入事件发生时，返回一个对state.inputValue赋值的函数
  .map(event => state => Object.assign({}, state, {inputValue: event.target.value}));

// 将递增、递减、输入可观察对象合并为一个可观察对象
var state = Rx.Observable.merge(
  increase,
  decrease,
  input
).scan((state, changeFn) => changeFn(state), {
  count: 0,
  inputValue: ''
});

var prevState = {};
state.subscribe((state) => {
  if (state.count !== prevState.count) {
    document.querySelector('#count').innerHTML = state.count;
  }
  if (state.inputValue !== prevState.inputValue) {
    document.querySelector('#hello').innerHTML = 'Hello ' + state.inputValue;
  }
  prevState = state;
});
```

## Immutable JS

> 你也可以使用Immutable JS为应用创建一个全局的state store。Immutable JS是创建不可变集合的很棒工具，它可以通过检查值是否改变来优化渲染过程。

``` javascript

```
