The next thing to do:

首先对于host的判断，从目前的在nome区域判断改为全局判断，然后根据本地数据目录来标明哪些是已使用nomo的
另外就是把nomo开放一个中间件模式，支持接受request和response来进行mock判断
对于日志这一块也要继续做下去

还有一个未来的想法，就是可以拦截某个请求，然后在日志中可以查看请求体，或者对请求体进行修改，然后继续发送出去，最终把响应再返回

如果可能的话希望可以支持直接根据原有接口的数据格式进行数据mock

对于jsonp形式的mock也得支持

The current intermediate is used 80 and 443 port , because there are already many tools occupied these two ports, must allow users free configure it in the future.