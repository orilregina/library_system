"""校园图书管理系统（简易版）。
文件测试项目

基于面向对象思想实现图书管理、用户管理、借阅管理等核心功能，
并提供一组完整的测试流程，便于直接运行查看效果。
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Dict, List, Optional


class BaseObject:
    """所有类的基类，提供通用统计与工具能力。"""

    total_count = 0

    def __init__(self) -> None:
        """初始化基类并累计系统对象总数。"""
        BaseObject.total_count += 1

    @classmethod
    def show_total_object(cls) -> None:
        """打印当前系统中所有对象的总数量。"""
        print(f"系统对象总数：{BaseObject.total_count}")

    @staticmethod
    def check_str_empty(s: object) -> bool:
        """校验字符串是否为空或仅包含空白字符。"""
        return not isinstance(s, str) or not s.strip()


class Book(BaseObject):
    """图书实体，负责维护图书基础信息与借阅状态。"""

    book_total = 0
    borrowed_total = 0

    def __init__(
        self,
        book_id: object,
        book_name: str,
        author: str,
        category: str,
        publish_date: Optional[datetime] = None,
    ) -> None:
        """初始化图书对象并校验必填字段。"""
        super().__init__()
        self._validate_required(book_id, "book_id")
        self._validate_required(book_name, "book_name")
        self._validate_required(author, "author")
        self._validate_required(category, "category")

        self.book_id = str(book_id).strip()
        self.book_name = book_name.strip()
        self.author = author.strip()
        self.category = category.strip()
        self.is_borrowed = False
        self.borrower: Optional[str] = None
        self.publish_date = publish_date or datetime.now()
        self.borrow_time: Optional[datetime] = None
        Book.book_total += 1

    @staticmethod
    def _validate_required(value: object, field_name: str) -> None:
        """校验必填字段是否为空。"""
        if field_name == "book_id":
            if value is None or str(value).strip() == "":
                raise ValueError("book_id 不能为空")
            return
        if BaseObject.check_str_empty(value):
            raise ValueError(f"{field_name} 不能为空")

    def borrow_book(self, user: "User") -> bool:
        """执行图书借阅，成功时更新借阅状态与统计数据。"""
        if self.is_borrowed:
            print(f"图书《{self.book_name}》已被借出，当前借阅人：{self.borrower}")
            return False
        self.is_borrowed = True
        self.borrower = user.user_id
        self.borrow_time = datetime.now()
        Book.borrowed_total += 1
        print(f"图书《{self.book_name}》借阅成功，借阅人：{user.user_name}")
        return True

    def return_book(self) -> bool:
        """执行图书归还，成功时恢复图书状态并打印借阅时长。"""
        if not self.is_borrowed:
            print(f"图书《{self.book_name}》当前未被借阅，无需归还。")
            return False

        borrow_duration = None
        if self.borrow_time is not None:
            borrow_duration = datetime.now() - self.borrow_time

        self.is_borrowed = False
        self.borrower = None
        self.borrow_time = None
        Book.borrowed_total -= 1

        if borrow_duration is not None:
            duration_days = max(borrow_duration.days, 0)
            print(f"图书《{self.book_name}》归还成功，借阅时长 {duration_days} 天。")
        else:
            print(f"图书《{self.book_name}》归还成功。")
        return True

    @classmethod
    def show_book_stat(cls) -> None:
        """打印图书统计信息。"""
        available_total = cls.book_total - cls.borrowed_total
        print(
            f"图书统计 -> 总图书数：{cls.book_total}，"
            f"已借阅：{cls.borrowed_total}，可借阅：{available_total}"
        )

    def __str__(self) -> str:
        """返回图书完整信息字符串。"""
        status = "已借出" if self.is_borrowed else "可借阅"
        borrower = self.borrower if self.borrower is not None else "无"
        return (
            f"编号：{self.book_id}，名称：{self.book_name}，作者：{self.author}，"
            f"分类：{self.category}，状态：{status}，借阅人：{borrower}"
        )


class User(BaseObject):
    """用户父类，提取学生和老师的共性属性与借阅行为。"""

    user_total = 0
    max_borrow_record = 0
    student_total = 0
    teacher_total = 0
    default_max_borrow = 0
    default_user_type = "用户"

    def __init__(
        self,
        user_id: object,
        user_name: str,
        user_type: Optional[str] = None,
        max_borrow: Optional[int] = None,
        register_date: Optional[datetime] = None,
    ) -> None:
        """初始化用户对象并校验核心字段。"""
        super().__init__()
        self._validate_required(user_id, "user_id")
        self._validate_required(user_name, "user_name")

        resolved_user_type = user_type or self.default_user_type
        if BaseObject.check_str_empty(resolved_user_type):
            raise ValueError("user_type 不能为空")

        self.user_id = str(user_id).strip()
        self.user_name = user_name.strip()
        self.user_type = resolved_user_type.strip()
        self.borrowed_books: List[Book] = []
        self.max_borrow = max_borrow if max_borrow is not None else self.default_max_borrow
        self.register_date = register_date or datetime.now()
        User.user_total += 1
        self._increase_user_type_count()

    @staticmethod
    def _validate_required(value: object, field_name: str) -> None:
        """校验用户必填字段是否为空。"""
        if value is None or BaseObject.check_str_empty(str(value)):
            raise ValueError(f"{field_name} 不能为空")

    def _increase_user_type_count(self) -> None:
        """根据用户类型累计对应数量。"""
        if self.user_type == "学生":
            User.student_total += 1
        elif self.user_type == "老师":
            User.teacher_total += 1

    def borrow(self, book: Book) -> bool:
        """用户借阅图书，校验借阅上限与图书状态。"""
        if len(self.borrowed_books) >= self.max_borrow:
            print(
                f"用户 {self.user_name} 当前已借 {len(self.borrowed_books)} 本，"
                f"已达到最大借阅数 {self.max_borrow}。"
            )
            return False

        if book.borrow_book(self):
            self.borrowed_books.append(book)
            current_count = len(self.borrowed_books)
            if current_count > User.max_borrow_record:
                User.max_borrow_record = current_count
            return True
        return False

    def return_(self, book: Book) -> bool:
        """用户归还图书，校验图书归属后执行归还。"""
        if book not in self.borrowed_books:
            print(f"图书《{book.book_name}》不在用户 {self.user_name} 的借阅列表中。")
            return False

        if book.return_book():
            self.borrowed_books.remove(book)
            return True
        return False

    def show_my_books(self) -> None:
        """打印当前用户已借阅图书。"""
        if not self.borrowed_books:
            print(f"用户 {self.user_name}：暂无借阅图书")
            return

        print(f"用户 {self.user_name} 当前借阅图书：")
        for book in self.borrowed_books:
            print(f"  编号：{book.book_id}，名称：{book.book_name}，作者：{book.author}")

    @classmethod
    def show_user_stat(cls) -> None:
        """打印系统用户统计信息。"""
        print(
            f"用户统计 -> 总用户数：{cls.user_total}，"
            f"系统最高单人借阅数：{cls.max_borrow_record}"
        )

    @classmethod
    def show_user_type_stat(cls) -> None:
        """打印学生和老师的数量统计。"""
        print(f"用户类型统计 -> 学生：{cls.student_total}，老师：{cls.teacher_total}")

    def __str__(self) -> str:
        """返回用户完整信息字符串。"""
        return (
            f"编号：{self.user_id}，姓名：{self.user_name}，类型：{self.user_type}，"
            f"最大借阅数：{self.max_borrow}，当前借阅数：{len(self.borrowed_books)}"
        )


class Student(User):
    """学生用户，最大借阅数量为 3 本。"""

    default_max_borrow = 3
    default_user_type = "学生"

    def __init__(self, user_id: object, user_name: str) -> None:
        """初始化学生对象。"""
        super().__init__(user_id=user_id, user_name=user_name)


class Teacher(User):
    """老师用户，最大借阅数量为 5 本。"""

    default_max_borrow = 5
    default_user_type = "老师"

    def __init__(self, user_id: object, user_name: str) -> None:
        """初始化老师对象。"""
        super().__init__(user_id=user_id, user_name=user_name)


class BookSystem(BaseObject):
    """图书管理系统入口，负责维护图书与用户并提供业务接口。"""

    def __init__(self) -> None:
        """初始化系统对象与内部存储容器。"""
        super().__init__()
        self.books: Dict[str, Book] = {}
        self.users: Dict[str, User] = {}

    def add_book(self, book: Book) -> bool:
        """添加图书到系统，校验图书编号不能重复。"""
        if book.book_id in self.books:
            print(f"添加图书失败：图书编号 {book.book_id} 已存在。")
            return False
        self.books[book.book_id] = book
        print(f"添加图书成功：{book.book_name}")
        return True

    def add_user(self, user: User) -> bool:
        """添加用户到系统，校验用户编号不能重复。"""
        if user.user_id in self.users:
            print(f"添加用户失败：用户编号 {user.user_id} 已存在。")
            return False
        self.users[user.user_id] = user
        print(f"添加用户成功：{user.user_name}（{user.user_type}）")
        return True

    def find_book(self, book_id: object) -> Optional[Book]:
        """根据图书编号查找图书对象。"""
        return self.books.get(str(book_id).strip())

    def find_user(self, user_id: object) -> Optional[User]:
        """根据用户编号查找用户对象。"""
        return self.users.get(str(user_id).strip())

    def system_borrow(self, user_id: object, book_id: object) -> bool:
        """执行系统级借阅操作。"""
        user = self.find_user(user_id)
        if user is None:
            print(f"借阅失败：用户编号 {user_id} 不存在。")
            return False

        book = self.find_book(book_id)
        if book is None:
            print(f"借阅失败：图书编号 {book_id} 不存在。")
            return False

        return user.borrow(book)

    def system_return(self, user_id: object, book_id: object) -> bool:
        """执行系统级归还操作。"""
        user = self.find_user(user_id)
        if user is None:
            print(f"归还失败：用户编号 {user_id} 不存在。")
            return False

        book = self.find_book(book_id)
        if book is None:
            print(f"归还失败：图书编号 {book_id} 不存在。")
            return False

        return user.return_(book)

    def show_all_books(self) -> None:
        """打印系统中所有图书的完整信息。"""
        print("\n系统全部图书信息：")
        if not self.books:
            print("暂无图书数据。")
            return
        for book in self.books.values():
            print(book)

    def show_all_users(self) -> None:
        """打印系统中所有用户的完整信息。"""
        print("\n系统全部用户信息：")
        if not self.users:
            print("暂无用户数据。")
            return
        for user in self.users.values():
            print(user)

    def find_book_by_category(self, category: str) -> List[Book]:
        """按分类查找图书并返回结果列表。"""
        if BaseObject.check_str_empty(category):
            return []
        return [book for book in self.books.values() if book.category == category.strip()]

    @staticmethod
    def show_system_menu() -> None:
        """打印系统操作菜单。"""
        print("**********校园图书管理系统**********")
        print("1. 添加图书  2. 添加用户  3. 图书借阅")
        print("4. 图书归还  5. 查看图书统计  6. 查看用户统计")
        print("7. 查看所有图书  8. 查看所有用户  9. 退出系统")
        print("**********************************")


def build_demo_system() -> BookSystem:
    """构建一套用于演示的完整系统数据。"""
    system = BookSystem()

    books = [
        Book("B001", "Python程序设计", "张三", "教材"),
        Book("B002", "三体", "刘慈欣", "小说"),
        Book("B003", "人工智能导论", "李四", "科技"),
        Book("B004", "数据库系统概论", "王五", "教材"),
        Book("B005", "时间简史", "霍金", "科普"),
        Book("B006", "深入理解计算机系统", "Randal Bryant", "科技"),
    ]
    users = [
        Student("S001", "小明"),
        Student("S002", "小红"),
        Student("S003", "小刚"),
        Teacher("T001", "李老师"),
        Teacher("T002", "王老师"),
    ]

    for book in books:
        system.add_book(book)

    for user in users:
        system.add_user(user)

    return system


def simulate_menu_flow(system: BookSystem) -> None:
    """按菜单流程展示系统核心操作。"""
    print("\n========== 系统菜单 ==========")
    BookSystem.show_system_menu()

    print("\n========== 合法借阅 ==========")
    system.system_borrow("S001", "B001")
    system.system_borrow("S001", "B002")
    system.system_borrow("T001", "B003")
    system.system_borrow("T002", "B004")

    print("\n========== 非法借阅 ==========")
    system.system_borrow("S002", "B001")
    system.system_borrow("S003", "B999")

    print("\n========== 借阅上限测试 ==========")
    system.system_borrow("S002", "B005")
    system.system_borrow("S002", "B006")
    extra_book = Book("B007", "算法图解", "Aditya Bhargava", "科技")
    system.add_book(extra_book)
    system.system_borrow("S002", "B007")
    overflow_book = Book("B008", "统计学习方法", "李航", "科技")
    system.add_book(overflow_book)
    system.system_borrow("S002", "B008")

    print("\n========== 合法归还 ==========")
    borrowed_book = system.find_book("B001")
    if borrowed_book is not None:
        borrowed_book.borrow_time = datetime.now() - timedelta(days=5)
    system.system_return("S001", "B001")

    second_borrowed_book = system.find_book("B003")
    if second_borrowed_book is not None:
        second_borrowed_book.borrow_time = datetime.now() - timedelta(days=2)
    system.system_return("T001", "B003")

    print("\n========== 非法归还 ==========")
    system.system_return("S003", "B002")
    unborrowed_book = system.find_book("B008")
    if unborrowed_book is not None:
        unborrowed_book.return_book()


def show_system_reports(system: BookSystem) -> None:
    """展示统计信息、查找结果和用户借阅明细。"""
    print("\n========== 统计信息 ==========")
    BaseObject.show_total_object()
    Book.show_book_stat()
    User.show_user_stat()
    User.show_user_type_stat()

    print("\n========== 图书分类查找 ==========")
    tech_books = system.find_book_by_category("科技")
    if tech_books:
        print("科技类图书：")
        for book in tech_books:
            print(f"  {book.book_id} - {book.book_name}")
    else:
        print("未找到该分类图书。")

    print("\n========== 用户借阅详情 ==========")
    for user_id in ("S001", "S002", "T001", "T002"):
        user = system.find_user(user_id)
        if user is not None:
            user.show_my_books()

    system.show_all_books()
    system.show_all_users()


def main() -> None:
    """程序入口，执行完整测试流程。"""
    try:
        system = build_demo_system()
        simulate_menu_flow(system)
        show_system_reports(system)
    except ValueError as exc:
        print(f"初始化失败：{exc}")


if __name__ == "__main__":
    main()
