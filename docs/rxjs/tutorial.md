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
// typing 'hello world'
var input = Rx.Observable.fromEvent(document.querySelector('input'), 'keypress');

// Filter out target values less than 3 characters long
input.filter(event => event.target.value.length > 2).subscribe(value => console.log(value)); // 'hel'

// Delay the events
input.delay(200).subscribe(value => console.log(value)); // 'h' -200ms-> 'e' -200ms-> 'l'...

// Only let through an event every 200ms
input.throttleTime(200).subscribe(value => console.log(value)); // 'h' -200ms-> 'w'

// Let through latest event after 200ms
input.debounceTime(200).subscribe(value => console.log(value)); // 'o' -200ms -> 'd'

// Stop the stream of events after 3 events
input.take(3).subscribe(value => console.log(value)); // 'hel'

// passes through events until other observable triggers an event
var stopStream = Rx.Observable.fromEvent(document.querySelector('button'), 'click');
input.takeUntil(stopStream).subscribe(value => console.log(value)); // 'hello' (click)
```

## 处理值
```javascript
// typing 'hello world'
var input = Rx.Observable.fromEvent(document.querySelector('input'), 'keypress');

// Pass on a new value
input.map(event => event.target.value).subscribe(value => console.log(value)); // 'h'

// Pass on a new value by plucking it
input.pluck('target', 'value').subscribe(value => console.loog(value)); // 'h'

// Pass the two previous values
input.pluck('target', 'value').pariwise().subscribe(value => console.log(value)); // ['h', 'e']

// Only pass unique values through
input.pluck('target', 'value').distinct().subscribe(value => console.log(value)); // 'helo wrd'

// Do not pass repeating values through
input.pluck('target', 'value').distinctUntilChannged().subscribe(value => console.log(value)); // 'helo world'
```

## 创建应用
> RxJS是一个很棒的工具，它使你的代码不容易出错。
