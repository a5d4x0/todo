# todo
##项目要求
###1. TODO项目：
用户可以配置丰富的TODO项目，包括：
项目标题
项目内容
项目标签
项目待完成时间（今日待办、明日待办、未来）
###2. 临时任务箱：
未添加待完成时间信息的TODO项目，放置于临时任务箱内，临时任务箱的功能包括：
添加临时任务（未设置待完成时间的任务）
删除临时任务
为临时任务设置时间（设置后变成非临时任务）
###3. 任务箱：
和临时任务箱一样，放置TODO项目列表，不同点在于，项目都配置了时间，功能包括：
添加任务（需要有待完成时间）
删除任务
删除时间信息，将任务退化为临时任务
任务需要按照时间（今日待办、明日待办、未来）聚类
###4. 标签任务列表：
根据标签进行聚类的TODO项目列表，功能包括：
标签聚类
常规任务操作（添加、删除、修改，唯一要注意的是，一旦删除标签，该任务将不会出现在标签列表里）
注意点：
临时任务和任务之间是互斥的，同一个TODO项目只能按照是否设置时间择其一；
标签任务和临时任务以及任务是重合的，判断标准是是否有标签；
对标签任务的操作会影响临时任务箱和任务箱的数据，反之亦然（说明Model层应该统一）。