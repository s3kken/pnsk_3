let eventBus = new Vue()

Vue.component('columns',{

template: `
<div class="list-notes">
    <div class="row-col">
    <create-card></create-card>
        <column-planned-tasks :cardList="cardsOne"></column-planned-tasks>
        <column-tasks-work :cardList="cardsTwo"></column-tasks-work>
        <column-testing :cardList="cardsThree"></column-testing>
        <column-completed-tasks :cardList="cardsFour"></column-completed-tasks>
    </div>
</div>
`,
data() {
    return {
        cardsOne: [],
        cardsTwo: [],
        cardsThree: [],
        cardsFour: []
    }
},
mounted() {
    eventBus.$on('card-submitted', card => {
        this.cardsOne.push(card)
    })
},

})

Vue.component('column-planned-tasks', {
    props: {
        cardList: [],
    },
    template: `
    <div class="col">
        <card-form
            v-for="card in cardList"
            :card="card">
        </card-form>
    </div>
    `,
    methods: {

    }
})

Vue.component('column-tasks-work', {
    props: {
        cardList: [],
    },
    template: `
    <div class="col">
        <card-form
            v-for="card in cardList"
            :card="card">
        </card-form>
    </div>
    `,
    methods: {

    }
})

Vue.component('column-testing', {
    props: {
        cardList: [],
    },
    template: `
    <div class="col">
        <card-form
            v-for="card in cardList"
            :card="card">
        </card-form>
    </div>
    `,
    methods: {
        
    }
})

Vue.component('column-completed-tasks', {
    props: {
        cardList: [],
    },
    template: `
    <div class="col">
        <card-form
            v-for="card in cardList"
            :card="card">
        </card-form>
    </div>
    `,
})

Vue.component('card-edit',{
    template:`
    <div class="cardOne">
    <button type="submit" v-if="show === false" @click="$emit('Edit', isEdit())">Редактирование</button>
        <form class="text-form-card" v-if="show === true">
            <label for="title">Редактирование</label>
            <input v-model="title" id="title" type="text" :placeholder="card.title">
            <textarea v-model="task" :placeholder="card.task"></textarea>
            <p>Дэдлайн: {{ card.deadline }}</p>
            <p>Дата создания: {{ card.dateCreate }}</p>
            <button type="submit" @click="$emit('Edit', isEdit())">Yes</button>
            <button type="submit" @click="$emit('Edit', show = false)">No</button>
        </form>
    </div>
    `,
    data() {
        return {
            show: false,
            title: this.card.title,
            task: this.card.task,
        }
    },
    props: {
        card: Object,
    },
    methods: {
        isEdit() {
            if (this.show == false)
                this.show = true;
            else {
                if (this.title)
                    this.card.title = this.title;

                if (this.task)
                    this.card.task = this.task;

                this.show = false;
            }

            return this.show;
        }
    },
})

Vue.component('card-form',{
    template: `
    <div class="cardOne">
    <div v-if="edit === false">
    <p>{{ card.title }}</p>
    <p>{{ card.task }}</p>
    <p>Deadline:{{ card.deadline }}</p>
    <p>Дата создания:{{card.dateCreate}}</p>
    <button type="submit">
    Переместить
    </button>
    </div>
    <card-edit :card="card" @Edit="edit = $event"></card-edit>
    </div>
    `,
    props: {
        card: Object,
        edit: Boolean,
    }
})

Vue.component('create-card',{
    template:`
    <div class="forms-create-card">
        <form class="text-form-card" @submit.prevent="onSubmit">
            <label for="title">Заголовок</label>
            <input v-model="title" id="title" type="text" placeholder="title">
            <textarea v-model="task" placeholder="task description"></textarea>
            <input v-model="deadline" type="date">
            <button type="submit">Создать</button>
            <p v-if="errors.length">
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>
        </form>
    </div>
    `,
    data(){
        return {
            title: null,
            task: null,
            deadline: null,
            dateCreate: null,
            errors: []
        }
    },
    methods:{
        onSubmit(){
            if(this.title && this.task && this.deadline){
                let card = {
                    title: this.title,
                    task: this.task,
                    deadline: this.deadline,
                    dateCreate: new Date().toLocaleString(),
                    reason: null,
                    completed: null,
                }
                eventBus.$emit('card-submitted', card)

                this.title = null
                this.task = null
                this.deadline = null
            } else {
                if (!this.title) this.errors.push("Заполните заголовок!")
                if (!this.task) this.errors.push("Заполните описание задачи!")
                if (!this.deadline) this.errors.push("Выберите дедлайн!")
            }
        }
    }
})

let app = new Vue({
    el: '#app',
    data(){
        return{

        }
    }

})