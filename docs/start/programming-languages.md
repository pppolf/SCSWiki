---
title: 程序设计语言导览
description: 通过图标、设计印象、发展史和特色代码认识 15 种常见程序设计语言
category: start
audience:
  - 本科新生
content_type: verified
status: active
maintainers:
  - SCSWiki 维护组
sources:
  - name: GitHub Octoverse 2025 编程语言趋势
    url: https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/
  - name: Dennis Ritchie《The Development of the C Language》
    url: https://www.nokia.com/bell-labs/about/dennis-m-ritchie/chist.html
  - name: Devicon 开源语言图标
    url: https://github.com/devicons/devicon
sidebar: false
aside: true
outline: [2, 2]
---

<ProgrammingLanguageNav />

# 15 种主流程序设计语言 {#overview}

15 门常见程序设计语言，从语法风格、设计取向到典型代码，放在同一页里对照着看。

::: tip 阅读方式
标题下方的斜体小字概括这门语言最鲜明的印象，正文再展开它的使用方式和设计特点，最后用一段代码把语言本身的味道写出来。
:::

::: tip 新生先看
先跟随课程学好 C 语言和程序设计基础，再根据目标选择一门实践语言即可。想做 Web 可以继续了解 JavaScript 和 TypeScript；偏数据、自动化或人工智能可以学习 Python；对系统、性能或基础设施感兴趣，可以在有基础后接触 C++、Go 或 Rust。
:::

<ContentMeta />

## TypeScript {#typescript}

> 给 JavaScript 加上编译期类型系统。

TypeScript 是建立在 JavaScript 之上的强类型语言，JavaScript 本身仍然是有效的 TypeScript，而 TypeScript 可以通过静态类型、类型推断、泛型、联合类型等机制，在代码真正运行之前发现大量错误。它尤其适合 `React`、`Next.js`、`Vue`、`Node.js`、`NestJS` 等现代前后端工程。

现代大型 Web 项目、`npm` 生态以及 AI 辅助编程都越来越需要明确的类型边界。清晰的类型信息不仅方便多人协作和重构，也能让工具更准确地理解代码。

::: info 发展史
TypeScript 由微软在 **2012 年**正式发布，核心设计由 Anders Hejlsberg 主导。它最初就是为了解决大型 JavaScript 项目在类型、重构和工具支持上的困难，同时保持与 JavaScript 的兼容。**TypeScript 1.0** 于 2014 年发布，此后随着 React、Node.js 和现代前端工程体系发展，逐渐从“可选的类型增强工具”变成大型 Web 项目的常见基础设施。进入 4.x、5.x 之后，类型推断、控制流分析和类型表达能力继续增强。
:::

**语言特色：** 判别联合 + 类型收窄

```typescript [result.ts]
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function unwrap<T>(result: Result<T>): T {
  if (result.ok) {
    return result.value;
  }

  throw new Error(result.error);
}

const result: Result<number> = { ok: true, value: 42 };
console.log(unwrap(result));
```

**代码说明：** 这种写法很能体现 TypeScript 的核心价值：代码仍然保持 JavaScript 的写法，但编译器已经能够理解不同业务状态对应的数据结构。

**常见场景：** 前端、大型 Web App、全栈、Node.js API、SDK。

## Python {#python}

> 可读性极强，同时也是数据与自动化生态中的主力语言。

Python 是高级、动态类型语言，以简洁语法、高级数据结构和快速开发能力闻名。它横跨机器学习、数据科学、自动化、Web 后端、科研和教育，因此很少有语言能覆盖如此多的开发领域。

在 GitHub 上，Python 长期拥有非常大的开发者规模。尤其在数据处理、科学计算和机器学习项目中，它拥有 `NumPy`、`Pandas`、`PyTorch`、`FastAPI` 等成熟生态。

::: info 发展史
Python 由 Guido van Rossum 在荷兰 CWI 工作期间于 **1989 年末**开始设计，1991 年公开了早期版本。它继承了 ABC 语言强调可读性的思想，同时加入异常处理、模块和面向对象等能力。**Python 2.0** 于 2000 年发布，**Python 3.0** 于 2008 年对语言做了不兼容但更统一的整理；Python 2 在 2020 年结束官方支持。随后 Python 依靠科学计算、Web、自动化和机器学习生态持续扩大影响力。
:::

**语言特色：** 结构模式匹配 + 极简数据模型

```python [router.py]
from dataclasses import dataclass

@dataclass
class Task:
    kind: str
    priority: int

def route(task: Task):
    match task:
        case Task("train", p) if p >= 10:
            return "GPU 集群"
        case Task("api", _):
            return "Web Server"
        case _:
            return "普通队列"

print(route(Task("train", 12)))
```

**代码说明：** Python 的特色往往不是某一个孤立语法，而是能用比较少的代码把数据结构、条件分派和业务逻辑表达清楚。

**常见场景：** 数据分析、自动化、爬虫、FastAPI / Django 后端、科研与机器学习。

## JavaScript {#javascript}

> Web 世界的原生通用语言。

JavaScript 是动态、多范式语言，拥有一等函数、闭包、原型对象模型和异步编程能力。它最初属于浏览器，但今天通过 `Node.js` 同样可以构建服务器、CLI、桌面程序以及各种开发工具。

即使 TypeScript 在大型工程里越来越普及，JavaScript 本身仍然拥有极其庞大的代码存量和生态；浏览器运行时、`npm` 生态和 `Node.js` 共同决定了它依然是 Web 开发最基础的一层。

::: info 发展史
JavaScript 由 Brendan Eich 于 **1995 年**在 Netscape 开发，早期曾使用 Mocha、LiveScript 等名称，随后改名 JavaScript。1997 年它被标准化为 **ECMAScript**。2000 年代 Ajax 推动浏览器端应用复杂度快速上升，2009 年 Node.js 又把 JavaScript 带到服务器端。**ES2015（ES6）** 引入 class、module、Promise、箭头函数等大量现代语法，之后 ECMAScript 转为持续迭代的年度标准。
:::

**语言特色：** Promise + async/await + 函数式组合

```javascript [fetch.mjs]
const urls = ['/api/user', '/api/messages', '/api/settings'];

const data = await Promise.all(
  urls.map(async (url) => {
    const response = await fetch(url);
    return response.json();
  }),
);

console.log(data);
```

**代码说明：** 这段代码同时体现了 JavaScript 常见的异步风格和数组函数式处理方式：多个网络请求可以直接组合成一个并发任务。

**常见场景：** 浏览器前端、Node.js、Serverless、Electron、Web 工具。

## Java {#java}

> 大型企业后端的长期主力。

Java 是静态类型 JVM 语言，以成熟的类型系统、垃圾回收、跨平台运行时、大型企业生态和长期兼容性著称。现代 Java 已经远不是过去“类特别多、代码特别长”的形象，`record`、`sealed class`、`lambda`、`pattern matching` 等能力显著提升了表达力。

在企业后端、金融系统和分布式服务中，Java 仍然拥有非常成熟的工具链和框架生态。很多大型系统选择它，不只是因为语言本身，还因为 JVM、监控、调优和长期维护体系都非常完善。

::: info 发展史
Java 起源于 Sun Microsystems 在 **1991 年**启动的 Green Project，James Gosling 等人为消费电子设备设计了一门名为 Oak 的语言，后来更名为 Java，并在 1995 年正式推出。它以 JVM 和“编写一次，到处运行”的跨平台理念迅速进入 Web 与企业软件领域。2004 年 Java 5 引入泛型、注解等重要特性；2010 年 Oracle 收购 Sun 后继续维护 Java 平台。近年的 Java 通过 record、sealed class、模式匹配和更快的版本迭代不断现代化。
:::

**语言特色：** sealed type + record + pattern matching

```java [ShapeDemo.java]
sealed interface Shape permits Circle, Rectangle {}

record Circle(double radius) implements Shape {}
record Rectangle(double width, double height) implements Shape {}

static double area(Shape shape) {
    return switch (shape) {
        case Circle c -> Math.PI * c.radius() * c.radius();
        case Rectangle r -> r.width() * r.height();
    };
}
```

**代码说明：** 这段代码把封闭类型层次、不可变数据记录和模式匹配放在一起，能看出现代 Java 在保持强类型的同时已经减少了很多样板代码。

**常见场景：** Spring Boot、金融系统、企业后台、分布式系统、大型微服务。

## C# {#csharp}

> 微软 .NET 生态的现代全能型语言。

C# 是现代、通用、面向对象的静态类型语言，同时大量吸收函数式编程思想。现代 C# 拥有 `LINQ`、`record`、`pattern matching`、`async/await`、泛型等非常成熟的高级特性。

除了 ASP.NET Core 企业后端，C# 在桌面开发、云服务以及 Unity 游戏开发中都有庞大代码库。它和 .NET 的结合让同一套语言能够覆盖服务器、客户端、工具和游戏等多种项目。

::: info 发展史
C# 由微软在 .NET 计划中开发，Anders Hejlsberg 是主要设计者之一，语言在 **2000 年**公开，并随 **.NET Framework 1.0** 于 2002 年正式进入开发者生态。之后 C# 先后加入泛型、LINQ、lambda、async/await 等能力，逐渐从传统面向对象语言发展为多范式语言。2010 年代 Roslyn 编译器和 .NET Core 开源，随后统一为现代 .NET 平台，使 C# 从 Windows 生态进一步扩展到 Linux、云服务和跨平台开发。
:::

**语言特色：** LINQ + record + with

```csharp [Orders.cs]
record Order(string Id, decimal Total);

var orders = new[]
{
    new Order("A01", 500m),
    new Order("A02", 1800m),
    new Order("A03", 1200m)
};

var vipOrders = orders
    .Where(o => o.Total >= 1000m)
    .OrderByDescending(o => o.Total)
    .Select(o => o with { Id = $"VIP-{o.Id}" });

foreach (var order in vipOrders)
    Console.WriteLine(order);
```

**代码说明：** `LINQ` 是 C# 很有代表性的能力：筛选、排序、投影等查询操作可以直接融进普通集合代码，并且保留完整的静态类型检查。

**常见场景：** ASP.NET Core、Azure、企业软件、Windows、Unity 游戏。

## PHP {#php}

> 依旧无法忽视的 Web 后端语言。

PHP 是围绕服务器端 Web 开发成长起来的动态语言，拥有非常直接的 HTTP / Web 编程模型，同时支持闭包、类型声明、类、接口、`trait` 等现代语言能力。WordPress、Laravel 等生态让它继续维持非常大的实际项目规模。

它和 Web 的结合非常直接：处理请求参数、模板、表单、数据库和 JSON 数据都很自然。现代 PHP 的类型系统和面向对象能力也比早期版本完整得多。

::: info 发展史
PHP 最早由 Rasmus Lerdorf 在 **1994 年**编写，用来维护个人主页和处理简单的 Web 请求，之后演化为 PHP/FI。1998 年 PHP 3 通过重写形成更完整的语言，Zeev Suraski 和 Andi Gutmans 随后开发 Zend Engine，成为 PHP 4 及后续版本的重要基础。PHP 5 强化了面向对象能力，**PHP 7** 在 2015 年大幅改善性能与内存效率，PHP 8 又加入 attributes、union types、JIT 等现代特性。
:::

**语言特色：** 关联数组 + Closure

```php [users.php]
<?php

$users = [
    ["name" => "Alice", "score" => 95],
    ["name" => "Bob",   "score" => 72],
    ["name" => "Carol", "score" => 91],
];

$top = array_filter(
    $users,
    fn($user) => $user["score"] >= 90
);

echo json_encode(array_values($top), JSON_PRETTY_PRINT);
```

**代码说明：** PHP 的数组既能当列表，也能当键值映射，再配合闭包和内置集合函数，处理典型 Web 数据时往往非常直接。

**常见场景：** Laravel、WordPress、CMS、电商、传统及现代 Web 后端。

## Shell / Bash {#bash}

> 操作系统和各种开发工具之间的“胶水”。

GitHub 榜单中的名称通常写作 Shell，并不单指 Bash；不过 Bash 是其中最典型的代表。Bash 同时是命令解释器和编程环境，条件语句、循环、变量、函数以及 `Unix pipeline` 让它特别适合组合已有命令完成自动化工作。

Shell 在 CI/CD、容器、Linux、云服务和自动化脚本中非常常见。它的优势不是重新实现所有功能，而是把系统里已有的小工具连接起来。

::: info 发展史
Shell 编程可以追溯到早期 Unix，Stephen Bourne 在 1970 年代开发的 Bourne shell（sh）奠定了许多语法基础。**Bash** 由 Brian Fox 为 GNU Project 开发，并在 **1989 年**发布，名称来自 “Bourne Again SHell”。它在兼容 Bourne shell 的基础上吸收了命令历史、作业控制和交互式编辑等功能，后来成为大量 Linux 发行版的重要默认 Shell，也长期作为脚本、构建和运维自动化的基础工具。
:::

**语言特色：** Unix Pipeline

```bash [largest-logs.sh]
#!/usr/bin/env bash
set -euo pipefail

find . -type f -name "*.log" -print0 |
  xargs -0 du -h |
  sort -hr |
  head -5
```

**代码说明：** 管道的思路很朴素：程序 A 的输出直接成为程序 B 的输入，再继续传给程序 C。多个小工具各做一件事，组合后完成完整任务。

**常见场景：** Linux、服务器管理、Docker、GitHub Actions、CI/CD、DevOps。

## C++ {#cpp}

> 当性能、资源控制和大型工程能力必须同时存在。

C++ 在接近底层硬件控制的同时，提供泛型、`RAII`、`template`、`range`、智能指针等高层抽象能力。它既能维护几十年前的系统，也能采用非常现代的编程范式。

游戏引擎、浏览器、数据库、高性能计算、图形系统和大量底层运行时仍然离不开 C++。这类项目通常既要求性能，又不能失去大型工程需要的抽象能力。

::: info 发展史
C++ 由 Bjarne Stroustrup 在贝尔实验室于 **1979 年**开始设计，最初名为 “C with Classes”，目标是在 C 的性能和底层控制能力上加入类与抽象机制，1983 年正式使用 C++ 这一名称。**C++98** 成为第一个 ISO 标准版本；2011 年的 C++11 是一次重要现代化，引入 auto、lambda、智能指针、移动语义和并发支持。此后的 C++14、17、20、23 持续强化泛型、编译期计算和标准库能力。
:::

**语言特色：** Ranges + Lambda + 零成本抽象

```cpp [ranges.cpp]
#include <iostream>
#include <ranges>
#include <vector>

int main() {
    std::vector<int> nums{1, 2, 3, 4, 5, 6};

    auto result = nums
        | std::views::filter([](int n) { return n % 2 == 0; })
        | std::views::transform([](int n) { return n * n; });

    for (int n : result)
        std::cout << n << ' ';
}
```

**代码说明：** 现代 C++ 已经可以写出接近函数式数据管道的代码，同时仍然保持原生编译和对底层资源的控制。

**常见场景：** Unreal Engine、数据库、浏览器、机器人、高性能计算、基础设施。

## Go {#go}

> 云原生时代最典型的系统 / 服务端语言之一。

Go 是强类型、编译型、带垃圾回收的通用语言，语法刻意保持简单，同时原生提供 `goroutine` 和 `channel` 作为并发编程的核心抽象。

Docker、Kubernetes 等云原生生态让 Go 与基础设施工程高度绑定。编译速度快、部署方便、标准库完整，也让它很适合网络服务和命令行工具。

::: info 发展史
Go 于 **2007 年**在 Google 内部开始设计，主要设计者包括 Robert Griesemer、Rob Pike 和 Ken Thompson。他们希望在大型软件工程中兼顾编译速度、简单语法、垃圾回收和并发能力。Go 在 2009 年开源，**Go 1.0** 于 2012 年发布并确立兼容性承诺。随后 Go Modules 改善依赖管理，**Go 1.18** 在 2022 年加入泛型，使语言在保持简洁的同时扩展了抽象能力。
:::

**语言特色：** Goroutine + Channel

```go [worker.go]
package main

import "fmt"

func worker(input <-chan int, output chan<- int) {
    n := <-input
    output <- n * 2
}

func main() {
    input := make(chan int)
    output := make(chan int)

    go worker(input, output)

    input <- 21
    fmt.Println(<-output)
}
```

**代码说明：** 在 Go 里，只需要在函数调用前加上 go 就能启动一个 `goroutine`；`channel` 则负责在并发任务之间传递数据。

**常见场景：** Kubernetes 生态、微服务、网络服务、CLI、云基础设施。

## C {#c}

> 几十年之后，底层软件依然绕不开它。

C 提供指针、结构体、直接内存访问以及非常轻量的运行模型。它缺少许多现代语言的自动安全保护，却因此给程序员极高的硬件和内存控制能力。

操作系统内核、嵌入式、驱动、运行时和大量基础库至今仍大量使用 C。理解它往往也意味着要真正理解地址、内存布局和数据在机器中的表示方式。

::: info 发展史
C 由 Dennis Ritchie 在贝尔实验室于 **1969—1973 年**间逐步设计，它从 BCPL 和 B 语言演化而来，并很快被用于重写 Unix 的大部分代码。这让操作系统第一次能够在保留底层效率的同时获得较好的可移植性。1978 年出版的《The C Programming Language》使 C 广泛传播；**ANSI C（C89）** 和 ISO C90 完成标准化，此后又出现 C99、C11、C17 和 C23 等版本。
:::

**语言特色：** 指针直接操作数据

```c [pointer.c]
#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

void translate(Point *p, int dx, int dy) {
    p->x += dx;
    p->y += dy;
}

int main(void) {
    Point p = {2, 3};
    translate(&p, 4, -1);
    printf("(%d, %d)\n", p.x, p.y);
}
```

**代码说明：** `Point *p`、`&p` 和 `p->x` 这一类写法对应的就是 C 世界最核心的一组概念：地址、指针以及对内存中对象的直接访问。

**常见场景：** Linux 内核、嵌入式、驱动、MCU、数据库底层、运行时。

## Rust {#rust}

> 在不使用传统垃圾回收器的前提下，把内存安全尽可能交给编译器保证。

Rust 主要出现在系统编程、基础设施、网络服务、嵌入式以及对性能要求较高的项目中。它的运行时负担很小，没有传统意义上的垃圾回收器，但又不像 C 和 C++ 那样把大部分内存安全问题完全交给开发者处理。

Rust 最有代表性的设计是所有权和借用系统。每个值都有明确的所有者，引用需要满足借用规则，很多悬空指针、重复释放和数据竞争问题会直接在编译阶段被拦下来。

::: info 发展史
Rust 最初是 Graydon Hoare 在 **2006 年**开始的个人项目，Mozilla 在 2009 年开始赞助，随后它与实验性浏览器引擎 Servo 的开发相互促进。Rust 在 2010 年公开，经过多次重大语法和所有权模型调整后，**Rust 1.0** 于 2015 年发布并建立稳定兼容承诺。2018、2021 等 Edition 继续改进语言体验；2021 年 Rust Foundation 成立，语言治理逐渐从 Mozilla 背景转向更独立的社区和基金会体系。
:::

**语言特色：** Ownership + Borrowing + Lifetime

```rust [borrow.rs]
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}

fn main() {
    let first = String::from("Rust");
    let second = String::from("TypeScript");

    let result = longest(&first, &second);
    println!("{result}");
}
```

**代码说明：** 这里的 `&str` 表示借用字符串而不是取得所有权，生命周期参数则描述返回引用和输入引用之间的关系。编译器会据此阻止返回已经失效的引用。

**常见场景：** CLI、网络服务、数据库组件、WebAssembly、系统软件、性能敏感型基础设施。

## Kotlin {#kotlin}

> 更现代、更简洁、更安全的 JVM 语言。

Kotlin 同时拥有面向对象和函数式编程能力，并特别强调 null safety：可空类型和不可空类型在类型系统中被明确区分，从而把许多空指针问题提前到编译阶段处理。它还能与 Java 生态深度互操作，并通过 `Kotlin Multiplatform` 扩展到多个平台。

另一个标志性能力是 coroutine，可以用看似顺序执行的代码描述异步逻辑。对于已有 Java 生态的团队来说，Kotlin 通常可以逐步引入，而不需要整体推倒重来。

::: info 发展史
Kotlin 由 JetBrains 在 **2010 年**开始设计，并于 2011 年公开。它的目标是在 JVM 上提供比 Java 更简洁的语法，同时保留与现有 Java 代码和生态的高度互操作性。Kotlin 在 2012 年开源，**Kotlin 1.0** 于 2016 年发布。2017 年 Google 宣布 Android 官方支持 Kotlin，2019 年进一步将其作为 Android 开发的首选语言之一；此后 Kotlin Multiplatform 又把它扩展到 iOS、桌面和共享业务逻辑。
:::

**语言特色：** Null Safety

```kotlin [Greeting.kt]
fun greeting(name: String?): String {
    return name
        ?.takeIf { it.isNotBlank() }
        ?.let { "Hello, $it!" }
        ?: "Hello, guest!"
}

fun main() {
    println(greeting("Ada"))
    println(greeting(null))
}
```

**代码说明：** `String?` 明确表示“这个字符串允许为 null”，而 `String` 默认不能为 null。安全调用 `?.` 和 Elvis 运算符 `?:` 让空值处理直接体现在表达式里。

**常见场景：** Android、Spring / JVM 后端、Kotlin Multiplatform、客户端开发。

## Ruby {#ruby}

> 追求开发者表达力与开发效率的动态语言。

Ruby 把“对象”贯彻得非常彻底，几乎一切都可以作为对象来操作。它大量使用 block、iterator、message passing 以及灵活的元编程能力，这也是 Ruby 代码经常读起来接近自然语言的原因。

Ruby on Rails 又进一步把 Ruby 的“约定优于配置、快速开发”哲学带进 Web 工程。它很适合需要快速构建业务功能和持续迭代的项目。

::: info 发展史
Ruby 由日本程序员 Yukihiro “Matz” Matsumoto 在 **1993 年**开始设计，并于 1995 年公开发布。Matz 希望把 Perl 的实用性、Smalltalk 的纯面向对象思想以及 Lisp 等语言的表达力结合起来，让程序员写代码时更自然。2004 年 Ruby on Rails 发布后，Ruby 在 Web 创业和快速应用开发中迅速流行。后续 Ruby 2.x、3.x 持续改善性能、并发和类型描述工具，同时保持强调可读性与开发者体验的风格。
:::

**语言特色：** Block + Enumerable

```ruby [scores.rb]
scores = {
  "Alice" => 95,
  "Bob"   => 76,
  "Carol" => 91
}

scores
  .select { |_, score| score >= 90 }
  .sort_by { |_, score| -score }
  .each do |name, score|
    puts "#{name}: #{score} ★"
  end
```

**代码说明：** Ruby 很少强迫开发者写大量仪式性的循环和临时代码，集合的筛选、排序和遍历往往可以自然地串成一段表达式。

**常见场景：** Rails、SaaS、Web 应用、脚本、快速原型。

## Swift {#swift}

> Apple 平台的现代、安全、高性能主力语言。

Swift 将静态类型、类型推断、`Optional`、`pattern matching` 和现代并发系统结合起来。`Optional` 要求开发者显式处理“可能没有值”的情况，而 Swift 的语言级并发系统也尝试在编译阶段减少数据竞争问题。

它是 iOS、macOS 等 Apple 平台现代应用开发的核心语言，同时也可以用于服务端等场景。近年来的 `actor`、`async/await` 等能力让并发代码的边界表达得更清楚。

::: info 发展史
Swift 由 Apple 在 2010 年代初开始开发，Chris Lattner 是早期核心设计者之一，并在 **2014 年 WWDC** 正式发布，用来逐步替代 Objective-C 成为 Apple 平台的新一代主力语言。2015 年 Swift 开源，之后语言经历了较快演进；Swift 3 对语法和 API 风格做了大幅整理，**Swift 5** 在 2019 年实现 Apple 平台上的 ABI 稳定。Swift 5.5 又加入 async/await 和 actor，把现代并发模型纳入语言核心。
:::

**语言特色：** Actor + async/await

```swift [Counter.swift]
actor Counter {
    private var value = 0

    func increment() {
        value += 1
    }

    func current() -> Int {
        value
    }
}

let counter = Counter()
await counter.increment()
print(await counter.current())
```

**代码说明：** `actor` 的重点是给共享可变状态建立明确的隔离边界。跨 `actor` 访问时使用 `await`，调用代码会清楚地知道这里已经进入并发语义。

**常见场景：** iOS、macOS、watchOS、visionOS、Apple 生态应用。

## Dart {#dart}

> 以 Flutter 为核心场景的现代多端开发语言。

Dart 最常见的使用场景是 Flutter。开发阶段可以依靠 `JIT` 获得快速迭代体验，发布时再通过 `AOT` 编译成本地代码，因此同一套语言能够覆盖移动端、桌面端和 Web。

Dart 的类型系统、异步语法和对象模型都比较现代。近年的 `record` 和 `pattern matching` 又让轻量数据结构与解构写法变得更自然，适合 UI 状态和业务数据的传递。

::: info 发展史
Dart 由 Google 开发，并在 **2011 年**公开，早期目标之一是为大型 Web 应用提供比传统 JavaScript 更结构化的开发体验。**Dart 1.0** 于 2013 年发布，Dart 2 在 2018 年强化静态类型体系，同年 Flutter 1.0 发布，使 Dart 的主要舞台逐渐从“浏览器替代语言”转向跨平台客户端开发。2021 年 Dart 引入健全的空安全，**Dart 3** 又进一步加入 records、patterns 等现代语言能力。
:::

**语言特色：** Records + Pattern Matching

```dart [records.dart]
({String name, int score}) bestStudent(
  List<({String name, int score})> students,
) {
  students.sort((a, b) => b.score.compareTo(a.score));
  return students.first;
}

void main() {
  final students = [
    (name: 'Ada', score: 98),
    (name: 'Linus', score: 95),
  ];

  final (:name, :score) = bestStudent(students);
  print('$name: $score');
}
```

**代码说明：** 函数可以直接返回一组具名字段，调用方再通过模式一次性解构。对于只需要临时组合几个值的场景，不必为了数据传递额外定义一个类。

**常见场景：** Flutter、Android / iOS 多端应用、桌面端、Web。

## 参考资料

::: details 各语言官方文档

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [Python 官方文档](https://docs.python.org/3/)
- [MDN JavaScript 指南](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Java 官方学习文档](https://dev.java/learn/)
- [C# 官方文档](https://learn.microsoft.com/en-us/dotnet/csharp/)
- [PHP 官方手册](https://www.php.net/manual/en/)
- [GNU Bash 官方手册](https://www.gnu.org/software/bash/manual/)
- [Standard C++ Foundation](https://isocpp.org/)
- [Go 官方文档](https://go.dev/doc/)
- [Rust 官方学习文档](https://www.rust-lang.org/learn)
- [Kotlin 官方文档](https://kotlinlang.org/docs/home.html)
- [Ruby 官方文档](https://www.ruby-lang.org/en/documentation/)
- [Swift 官方文档](https://www.swift.org/documentation/)
- [Dart 官方语言文档](https://dart.dev/language)

:::

## 阅读说明

- 页面中的示例用于展示语言特色，不替代完整教程、课程大纲或官方文档。
- “常见场景”描述的是典型应用方向，不意味着语言只能用于这些领域。
- 版本、生态和语言排名会持续变化；涉及具体语法和工具链时，以各语言官方文档为准。
