// 全局变量
let currentCategory = '工作';
let wheelItems = ['道歉', '买零食', '做家务', '讲故事', '亲亲', '抱抱'];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面并初始化相应功能
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '') {
        initPage1();
    } else if (currentPage === 'main.html') {
        initPage2();
    } else if (currentPage === 'food.html') {
        initPage3();
    } else if (currentPage === 'wheel.html') {
        initPage4();
    } else if (currentPage === 'notes.html') {
        initPage5();
    }
});

// 初始化页面1（登录页面）
function initPage1() {
    const enterBtn = document.getElementById('enterBtn');
    const passwordInput = document.getElementById('password');
    
    enterBtn.addEventListener('click', function() {
        // 默认密码为 'love'，可根据需要修改
        if (passwordInput.value === 'love') {
            window.location.href = 'main.html';
        } else {
            alert('密码错误，请重试！');
        }
    });
    
    // 回车键登录
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enterBtn.click();
        }
    });
}

// 初始化页面2（主页面）
function initPage2() {
    // 主页面无需特殊初始化
}

// 初始化页面3（今日菜系）
function initPage3() {
    const addRecipeBtn = document.getElementById('addRecipeBtn');
    
    addRecipeBtn.addEventListener('click', addRecipe);
    
    // 加载已保存的菜谱
    loadRecipes();
}

// 添加菜谱
function addRecipe() {
    const recipeName = document.getElementById('recipeName').value;
    const recipeDesc = document.getElementById('recipeDesc').value;
    
    if (!recipeName.trim()) {
        alert('请输入菜谱名称！');
        return;
    }
    
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const newRecipe = {
        id: Date.now(),
        name: recipeName,
        desc: recipeDesc,
        date: new Date().toLocaleString()
    };
    
    recipes.push(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    
    // 清空输入框
    document.getElementById('recipeName').value = '';
    document.getElementById('recipeDesc').value = '';
    
    // 重新加载菜谱列表
    loadRecipes();
}

// 加载菜谱
function loadRecipes() {
    const recipesList = document.getElementById('recipesList');
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    
    recipesList.innerHTML = '';
    
    recipes.forEach(recipe => {
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe-item';
        recipeItem.innerHTML = `
            <div class="recipe-info">
                <div class="recipe-title">${recipe.name}</div>
                <div class="recipe-desc">${recipe.desc || '无描述'}</div>
                <div class="recipe-date">添加时间：${recipe.date}</div>
            </div>
            <button onclick="deleteRecipe(${recipe.id})">删除</button>
        `;
        recipesList.appendChild(recipeItem);
    });
}

// 删除菜谱
function deleteRecipe(id) {
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes = recipes.filter(recipe => recipe.id !== id);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    loadRecipes();
}

// 初始化页面4（消气转盘）
function initPage4() {
    const addWheelItemBtn = document.getElementById('addWheelItemBtn');
    
    addWheelItemBtn.addEventListener('click', addWheelItem);
    
    // 加载已保存的转盘选项
    loadWheelItems();
    
    // 初始化转盘
    updateWheel();
}

// 添加转盘选项
function addWheelItem() {
    const wheelItemInput = document.getElementById('wheelItem');
    const item = wheelItemInput.value.trim();
    
    if (!item) {
        alert('请输入转盘选项！');
        return;
    }
    
    wheelItems.push(item);
    localStorage.setItem('wheelItems', JSON.stringify(wheelItems));
    wheelItemInput.value = '';
    
    // 更新转盘和选项列表
    loadWheelItems();
    updateWheel();
}

// 加载转盘选项
function loadWheelItems() {
    const savedItems = localStorage.getItem('wheelItems');
    if (savedItems) {
        wheelItems = JSON.parse(savedItems);
    }
    
    const wheelItemsList = document.getElementById('wheelItemsList');
    wheelItemsList.innerHTML = '';
    
    wheelItems.forEach((item, index) => {
        const wheelItem = document.createElement('div');
        wheelItem.className = 'wheel-item';
        wheelItem.innerHTML = `
            <span>${item}</span>
            <button onclick="deleteWheelItem(${index})">删除</button>
        `;
        wheelItemsList.appendChild(wheelItem);
    });
}

// 删除转盘选项
function deleteWheelItem(index) {
    if (wheelItems.length <= 2) {
        alert('转盘至少需要2个选项！');
        return;
    }
    
    wheelItems.splice(index, 1);
    localStorage.setItem('wheelItems', JSON.stringify(wheelItems));
    
    // 更新转盘和选项列表
    loadWheelItems();
    updateWheel();
}

// 更新转盘
function updateWheel() {
    const wheel = document.getElementById('wheel');
    const segmentCount = wheelItems.length;
    const anglePerSegment = 360 / segmentCount;
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#e17055', '#fdcb6e'];
    
    wheel.innerHTML = '';
    
    wheelItems.forEach((item, index) => {
        const segment = document.createElement('div');
        segment.className = 'wheel-segment';
        
        // 设置旋转角度
        segment.style.transform = `rotate(${index * anglePerSegment}deg) skewY(${90 - anglePerSegment}deg)`;
        
        // 设置背景颜色
        segment.style.backgroundColor = colors[index % colors.length];
        
        // 创建文本元素并旋转回来
        const text = document.createElement('div');
        text.textContent = item;
        text.style.transform = `skewY(${anglePerSegment - 90}deg) rotate(${90 - index * anglePerSegment}deg)`;
        text.style.width = '100px';
        text.style.textAlign = 'center';
        
        segment.appendChild(text);
        wheel.appendChild(segment);
    });
}

// 旋转转盘
function spinWheel() {
    const wheel = document.getElementById('wheel');
    const segmentCount = wheelItems.length;
    const anglePerSegment = 360 / segmentCount;
    
    // 随机旋转圈数和角度
    const randomRotations = Math.floor(Math.random() * 5) + 10; // 10-14圈
    const randomAngle = Math.random() * 360;
    const totalRotation = randomRotations * 360 + randomAngle;
    
    // 应用旋转动画
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    
    // 计算结果
    setTimeout(() => {
        const resultIndex = Math.floor(((360 - (totalRotation % 360)) % 360) / anglePerSegment);
        const result = wheelItems[resultIndex];
        document.getElementById('spinResult').textContent = `结果：${result}`;
    }, 3000);
}

// 初始化页面5（记事本）
function initPage5() {
    const addNoteBtn = document.getElementById('addNoteBtn');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    addNoteBtn.addEventListener('click', addNote);
    
    // 分类切换
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的active类
            categoryBtns.forEach(b => b.classList.remove('active'));
            // 添加当前按钮的active类
            this.classList.add('active');
            // 更新当前分类
            currentCategory = this.dataset.category;
            // 加载对应分类的笔记
            loadNotes();
        });
    });
    
    // 加载笔记
    loadNotes();
}

// 添加笔记
function addNote() {
    const noteContent = document.getElementById('noteContent');
    const content = noteContent.value.trim();
    
    if (!content) {
        alert('请输入笔记内容！');
        return;
    }
    
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const newNote = {
        id: Date.now(),
        category: currentCategory,
        content: content,
        date: new Date().toLocaleString()
    };
    
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    
    // 清空输入框
    noteContent.value = '';
    
    // 重新加载笔记
    loadNotes();
}

// 加载笔记
function loadNotes() {
    const notesList = document.getElementById('notesList');
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    
    // 过滤当前分类的笔记
    const filteredNotes = notes.filter(note => note.category === currentCategory);
    
    notesList.innerHTML = '';
    
    // 倒序显示（最新的在前面）
    filteredNotes.reverse().forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.innerHTML = `
            <div class="note-category">${note.category}</div>
            <div class="note-content">${note.content}</div>
            <div class="note-date">添加时间：${note.date}</div>
            <button onclick="deleteNote(${note.id})">删除</button>
        `;
        notesList.appendChild(noteItem);
    });
}

// 删除笔记
function deleteNote(id) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

// 图片替换背景图功能（根据页面编号）
function changeBackgroundImage(pageNumber, imageUrl) {
    // 这个函数可以在控制台调用，用于替换背景图
    // 例如：changeBackgroundImage(1, 'url_to_image.jpg')
    const pageElement = document.querySelector(`.page${pageNumber}`);
    if (pageElement) {
        pageElement.style.backgroundImage = `url('${imageUrl}')`;
        pageElement.style.backgroundSize = 'cover';
        pageElement.style.backgroundPosition = 'center';
    }
}