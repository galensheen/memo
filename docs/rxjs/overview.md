# 概要
------------------------------------------------
## 介绍
RxJS是一个使用有序的可观察对象处理异步和事件应用的库。它提供一个核心的类型--可观察对象(Observer, Schedulers, Subjects)和一些类数组的操作像处理集合一样处理异步事件。
> 可以认为RxJS是事件中的loadash

RactiveX将观察模式、迭代模式和函数变成结合起来，成为处理一系列事件流的完美工具。

RxJS解决异步事件的核心概念有:

* Observable: 在将来某时可以调用的值或事件
* Observer: 用于监听Observable的一系列回调的集合
* Subscription: 可观察对象的执行，对于取消执行非常有用
* Operators: 函数编程形式的纯函数，像数组一样的操作方式来处理集合，例如: map, filter, concat etc
* Subject: 相当于EventEmiter，向Observer发出广播事件的唯一方法
* Scheduler: 处理并发的调度中心，允许我们协调不同的计算

### 第一个例子
Normally you register event listeners.

```javascript
var button = document.querySelector('button');
button.addEventListener('click', () => console.log('Clicked!'));
```
使用RxJS可以这样写

```javascript
var button = document.querySelector('button');
Rx.Observable.fromEvent(button, 'click').subscribe(() => console.log('Clicked!'));
```

#### 纯函数
使RxJX这么强大的是它使用纯函数的特性来处理值。这意味着你的代码很少会出错。
一般情况下创建的非纯函数，状态会被一个代码片段影响。

```javascript
var count = 0;
var button = document.querySelector('button');
button.addEventListener('click', () => console.log(`Clicked ${++count} times`));
```

使用RxJS可以将状态隔离

```javascript
var button = document.querySelector('button');
Rx.Observable.fromEvent(button, 'click')
	.scan(count => count + 1, 0)
	.subscribe(count => console.log(`Clicked ${count} times`));
```
> scan操作类似数组的reduce方法。

#### 流
RxJS有一系列的方法来帮助你控制怎么让事件通过可观察者。

这是用纯javascript实现的美妙最多单击一次：

```javascript
var count = 0;
var rate = 1000;
var lastClick = Date.now() - rate;
var button = document.querySelector('button');
button.addEventListener('click', () => {
	if (Date.now() - lastClick >= rate) {
		console.log(`Clicked ${++count} times`);
		lastClick = Date.now();
	}
});
```
使用RxJS可以这样写:

```javascript
var button = document.querySelector('button');
Rx.Observable.fromEvent(button, 'click')
	.throttleTime(1000)
	.scan(count => count + 1, 0)
	.subscribe(count => console.log(`Clicked ${count} times`));
```
> 其他控制流的方法有: filter, delay, debounceTime, take, takeUntil, distinct, distinctUntilChanged etc.

### 值
你可以改变可观察对象里的值。

下面是一个使用纯javascript实现的获取x坐标的方法:

```javascript
var count = 0;
var rate = 1000;
var button = document.query.querySelector('button');
button.addEventListener('click', (event) => {
	if (Date.now() - lastLick >= rate) {
		console.log(++count + event.clientX);
		lastClick = Date.now();
	}
})
```

使用RxJS可以这样写:

```javascript
var button = document.querySelector('button');
Rx.Observable.fromEvent(button, 'click')
	.throttleTime(1000)
	.map(event => event.clientX)
	.scan((count, clientX) => count + clientX, 0)
	.subscribe(count => console.log(count));
```
> 其它处理值的方法有: pluck, pairwise, sample etc.

## 可观察对象
可观察者是可以推送多个值的集合，关系如下表:

|     | Single | Multiple|
|-----|--------|---------|
| Pull| Functon| Iterator|
| Push| Promise| Observable|

例如: 下面首先同步推送值1,2,3，然后1秒后推送值4，完成操作:

```javascript
var observable = Rx.Observable.create(function (observer) {
	observer.next(1);
	observer.next(2);
	observer.next(3);
	setTimeout(() => {
		observer.next(4);
		observer.complete();
	}, 1000);
});
console.log('just before subscribe');
observable.subscribe({
	next: x => console.log('got value ' + x),
	error: err => console.error('something wrong occurred: ' + err),
	complete: () => console.log('done')
});
console.log('just after subscribe');
```

运行结果是:

> just before subscribe
> got vlaue 1
> got value 2
> got value 3
> just after subscribe
> got value 4
> done


### Pull vs Push

Pull和Push是提供生产者和消费者交互的两个不同的协议。

**Pull**: 消费者决定合适从生产者获取数据。生产者不会主动通知消费之值的改变。每一个js函数都是一个pull。函数是数据的生产者，消费者通过pulling的调用方式来消费，然后访苏返回一个唯一的值。

**Push**: 生产者决定什么时候把数据发送给消费者。消费者对数据何时到达没有感知。今天的javascript里，Promise是很典型的push类型。Promise推送数据触发回调。

**Observer** 是RxJS为javascript提供的新push系统。一个Observable(生产者)可以处理多个值，并将他们推送给Observers(消费者).

### Observables as generalizations of functions

Observables即不像EventEmitters也不像Promises，它可以处理多个值。
> Observables类似不需要参数的函数，但是可以处理很多值。

考虑下面的代码:

```javascript
function foo() {
	console.log('Hello');
	return 42;
}

var x = foo.call(); // same as foo()
console.log(x);
var y = foo.call(); // same as foo()
console.log(y);
```

结果如下:

```javascript
"Hello"
42
"Hello"
42
```

你可以使用RxJS达到同样的效果:

```javascript
var foo = Rx.Observable.create(function (observer) {
	console.log('Hello');
	observer.next(42);
});
foo.subscribe(function (x) {
	console.log(x);
})
foo.subscribe(function (y) {
	console.log(y);
})
```
发生这样的情况是因为functions和observable都是懒执行。如果不调用function，则console.log('Hello')不会执行。同样适用于observable，如果不调用(subscribe)，则console.log('Hello')不执行。另外，'调用'和'订阅'是隔离的两个操作: 函数调用两次则有两次结果，同样领个Observable订阅产生两次效果。这个EventEmitter不同，EventEmitter不共享效果并且不关心是否有订阅者，Observable不共享执行并且是懒执行。
> 订阅一个Observable类似调用一个函数。
> Observables可以同步也可以异步

Observables和function的不同之处是，Observables可以"return"多次(类似es6的generator)，但是函数不能。

```javascript
// Observable的同步调用
var foo = Rx.Observable.create(function (observer) {
	console.log('Hello');
	observer.next(42);
	observer.next(100);
	observer.next(200);
});

// Observble的异步调用


console.log('before');
foo.subscribe(x => console.log(x));
console.log('after');
```

总结:

* func.call() 同步调用并返回一个值
* observable.subscribe() 同步或异步调用，并返回一系列值

### 剖析一个可观察对象
Observable可以使用Rx.Observable.create或者其他创建操作，由Observer来订阅。通过执行next/error/complete通知Observer，并对执行进行处理。

* **Creating** Observables
* **Subscribing** to Observables
* **Executing** the Observable
* **Disposing** Observables

#### 创建可观察对象
Rx.Observable.create是Observable构造函数的另外实现，它接收一个subscribe函数。

下面的例子创建一个Observable并且每分钟向Observer传递一个'hi'

```javascript
var observable = Rx.Observable.create(function subscribe(observer) {
	var id = setInterval(() => {
	observer.next('hi')}, 1000);
});
```
> Observables 可以使用create创建，但是更常见的是使用of, from, interval etc.

#### 取消订阅

```javascript
var observable = Rx.Observable.from([10, 20, 30]);
var subscription = observable.subscribe(x => console.log(x));
// Later
subscription.unsubscribe();
```

## 观察者
**Observer是什么？**Observer是Observable的消费者。Observers是一些callback组成的回调，用来接收Observable方法next, error, complete的结果。

```javascript
var observer = {
	next: x => console.log('Observer got a next value: ' + x),
	error: err => console.error('Observer got an error: ' + err),
	complete: () => console.log('Observer got a complete notification')
};

observable.subscribe(observer);
```
> Observers是一个包含3个回调函数的对象，每一个回调函数对应Observable的一个通知。
> Observers对象中的3个回调函数不是完全必须的。如果没有提供某一个对应的回调函数，则对应的Observable通知将会被忽略。

订阅一个Observable的时候，也可以只传一个回调函数作为参数而不是一个完整的Observer对象:

```javascript
observable.subscribe(x => console.log('Observer got a next value: ' + x));
```

3个回调都可以参数的形式订阅Observable

```javascript
observable.subscribe(
	x => console.log('Observer got a next value: ' + x),
	err => console.error('Observer got an error: ' + err),
	() => console.log('Observer got a complete notification')
)
```
## 订阅

**Subscription是什么?** Subscription通常是由订阅Observable后返回的一个可丢弃的资源，它有一个重要的方法: unsubscribe, 它不需要参数，只是丢弃对应的订阅。

```javascript
var observable = Rx.Observable.interval(1000);
var subscription = observable.subscribe(x => console.log(x));
// Later
subscription.unsubscribe();
```

> Subscription本质上只包含一个unsubscribe()的函数，用来释放或者取消Obsevable的执行。

多个Subscriptions可以组合起来，这样调用一个unsubscribe可以释放多个subscription。你可以向下面一样把一个subscription和另外一个组合起来:

```javascript
var observable1 = Rx.Observable.interval(400);
var observable2 = Rx.Observable.interval(300);

var subscription = observable1.subscribe(x => console.log('first: ' + x));
var childSubscription = observable2.subscribe(x => console.log('second: ' + x));

subscription.add(childSubscription);

setTimeout(() => {
	subscription.unsubscribe();
}, 1000);
```
> Subscriptions还有一个remove(otherSubscription)的方法。

## Subject
**Subject是什么？**Subject是一个特殊类型的Observable对象，它可以将值广播给更多的Observers，普通的Observable不能广播。
> Subject是Observable的一种，但是可以广播给更多的Observers, 就像EventEmitters，可以注册多个监听者。

**每一个Subject都是Observable**。给定一个Subject，你可以订阅，并且正常的接收数据。从Observer来看，不能确定对应的Observable是一个普通的Observable还是一个Subject。

从Subject的内部看，subscribe并没有调用一个新的执行去分发值。只是简单的注册一个Observer到Observers列表，就想addListener一样。

**每一个Subject都是一个Observer**，是一个拥有next, error, complete方法的对象。要传给Subject一个值，只要调用next(value)，它就会把这个值广播给所有的订阅的Observers。

下面的例子中，有两个Observers订阅Subject, 并且传给Subject一些值。

```javascript
var subject = new Rx.Subject();
subject.subscribe({next: (v) => console.log('observerA: ' + v)});
subject.subscribe({next: (v) => console.log('observerB: ' + v)});
subject.next(1);
subject.next(2);
```
由于Subject同时也是一个Observer，意味着我们可以用Subject去订阅任何的Observable，如:

```javascript
var subject = new Rx.Subject();

subject.subscribe({next: (v) => console.log('observerA: ' + v)});
subject.subscribe({next: (v) => console.log('observerB: ' + v)});

var observable = Rx.Observable.from([1,2,3]);
observable.subscribe(subject);
```

> Subject还有一些其它的特性: BehaviorSubject, ReplaySubject, and AsyncSubject.

### 广播Observables
multicasted Observable可以将通知下发给拥有多个订阅者的Subject，而不可广播的Observable只能将通知下发给一个订阅者。
> Multicasted Observable通过Subject，使更多的订阅者观察到同一个Observable的执行。

这个钩子就是广播的实现方式: 订阅者们订阅一个Subject, 这个Subject订阅一个源Observable。

下面的例子类似之前使用了obversable.subscribe(Subject)的例子

```javascript
var source = Rx.Observable.of([1,2,3]);
var subject = new Rx.Subject();
var multicasted = source.multicast(subject);

// 等价于source.subscribe()
multicasted.subscribe({
	next: x => console.log('observerA: ' + x);
});
multicasted.subscribe({
	next: x => console.log('observerB: ' + x);
});

// 等价于source.subscribe(suject)
multicasted.connect();
```

#### Reference counting
手动调用connect()和处理Subscription总是显得有些笨重。通常，我希望第一个Observer到达的时候自动connect，并且当最后一个Observer取消订阅的时候自动取消共享。

考虑下面的例子:

1. 第一个Observer订阅广播Observable
2. **广播Observable连接**
3. next的值0广播给第一个订阅者
4. 第二个Observer订阅广播Observable
5. next的值1广播给第一个订阅者
6. next的值1广播给第二个订阅者
7. 第一个订阅者取消订阅广播Observable
8. next的值2广播给第二个订阅者
9. 第二个订阅者取消订阅广播Observable
10. **广播observable的订阅取消**

直接使用connect来实现，代码如下:

```javascript
var source = Rx.Observable.interval(500);
var subject = new Rx.Subject();
var multicasted = source.multicast(subject);
var subscription1, subscription2, subscriptionConnect;

subscription1 = multicasted.subscribe({
	next: (v) => console.log('observerA: ' + v);
});

subscriptionConnect = multicasted.connect();

setTimeout(() => {
	subscription2 = multicasted.subscribe({
		next: (v) => console.log('observerB: ' + v);
	});
}, 600);

setTimeout(() => {
	subscription1.unsubscribe();
}, 1200);

setTimeout(() => {
	subscription2.unsubscribe();
	sbscriptionConnect.unsubscribe();
}, 2000);
```

如果不想直接使用connect(), 我们可以使用refCount()这个方法。这个方法返回一个跟踪订阅者数量的Observable。当订阅数从0变为1的时候，将替我们执行connect()。当订阅书从1变为0的时候，将自动停止订阅。
> refCount可以使广播Observable在第一个订阅出现的时候自动connect, 订阅数变为0的时候停止订阅。

下面是一个例子:

```javascript
var source = Rx.Observable.interval(500);
var subject= new Rx.Subject();
var refCounted = source.multicast(subject).refCount();
var subscription1, subscription2, subscriptionConnect;

console.log('observerA subscribed');
subscription1 = refCounted.subscribe({
	next: (v) => console.log('observerA: ' + v);
});

setTimeout(() => {
	console.log('observerB subscribed');
	subscription2 = refCounted.subscribe({
		next: (v) => console.log('observerB: ' + v);
	});
}, 600);

setTimeout(() => {
	console.log('observerA unsubscribed');
	subscription1.unsubscribe();
}, 1200);

setTimeout(() => {
	console.log('observerB unsubscribed');
	subscription2.unsubscribe();
}, 2000);

```

#### BehaviorSubject
`BehaviorSubject`是Subjects的一个变体，具有"the current value"的概念。它保存这发送给消费者的最后一个值，无论何时有新的订阅者加入时，它都会立即将保存的只发送给这个新订阅者。

接下来的例子，BehaviorSubject的初始值为0，第一个订阅者将接收到这个值。第二个订阅者将接收到2，尽管这个时候2已经发送出去了。

```javascript
var subject = new Rx.BehaviorSubject(0);
subject.subscribe({
	next: (v) => console.log('observerA: ' + v)
});

subject.next(1);
subject.next(2);

subject.subscribe({
	next: (v) => console.log('observerB: ' + v)
});

subject.next(3);
```

#### ReplaySubject
`ReplaySubject`类似`BehaviorSubject`， 它可以记录过去的值。
> ReplaySubject记录了Observable的多个值，并且重新传给新的subscribers

当创建一个`ReplaySubject`，可以指定回放多少个值:

```javascript
var subject = new Rx.ReplaySubject(3);

subject.subscribe({
	next: (v) => console.log('observerA: ' + v)
});

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

subject.subscribe({
	next: (v) => console.log('observerB: ' + v)
});

subject.next(5);
```

#### AsyncSubject
`AsyncSubject`是一个变体，他只发送最后一个Observable的值，并且当Observable完成的时候触发。

```javascript
var subject = new Rx.AsyncSubject();

subject.subscribe({
	next: (v) => console.log('observerA: ' + v)
});

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

subject.subscribe({
	next: (v) => console.log('observerB: ' + v)
});

subject.next(5);
subject.complete();

//输出:
observerA: 5
observerB: 5
```
## Operators

### 什么是Operators

### 实例operators vs 静态operators

### Marble diagrams

### 选择一个operator

### 分类

#### 创建

#### 转换

#### 过滤

#### 连接

#### 广播

#### 错误处理

#### 适用操作

#### 条件和布尔

#### 数学和集合

## Scheduler(调度)

### 调度类型

### 使用调度
