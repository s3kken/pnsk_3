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
    eventBus.$on('MoveToTwo', card => {
        this.cardsTwo.push(card)
    })

    eventBus.$on('MoveToThree', card => {
        this.cardsThree.push(card)
    })

    eventBus.$on('MoveToFour', card => {
        this.cardsFour.push(card)
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
            :card="card"
            :MoveCard="MoveCard">
        </card-form>
    </div>
    `,
    methods: {
        MoveCard(card) {
            eventBus.$emit('MoveToTwo', card)
            this.cardList.splice(this.cardList.indexOf(card), 1);
        }
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
            :card="card"
            :MoveCard="MoveCard">
        </card-form>
    </div>
    `,
    methods: {
        MoveCard(card) {
            eventBus.$emit('MoveToThree', card);
            this.cardList.splice(this.cardList.indexOf(card), 1);
        }
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
            :card="card"
            :MoveCard="MoveCard"
            :last="true">
        </card-form>
    </div>
    `,
    methods: {
        MoveCard(card, last) {
            if (last === undefined) {
            this.CompareDate(card);
            eventBus.$emit('MoveToFour', card);
            this.cardList.splice(this.cardList.indexOf(card), 1);
        } else {
            eventBus.$emit('MoveToTwo', card);
            this.cardList.splice(this.cardList.indexOf(card), 1);
        }
        },
        CompareDate(card) {
            if (new Date(card.deadline) < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) {
                card.completed = true;
            } else {
                card.completed = false;
            }
        }
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
            reason: this.card.reason,
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

                if (this.reason)
                    this.card.task = this.reason;

                this.card.dateEdit = new Date().toLocaleString();

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
    <p v-if="card.dateEdit != null">Редактирование: {{ card.dateEdit }}</p>
    <p v-if="last != true && card.reason != null || card.reason != ''">Причина возврата: {{ card.reason }}</p>
    <p>Дата создания:{{card.dateCreate}}</p>
    <p v-if="card.completed != null">Карточка:  {{ card.completed ? 'Просрочен' : 'Выполнен' }}</p>
    <button type="submit" @click="MoveCard(card)"  v-if="card.completed === null">
    Переместить
    </button>
            <add-reason
                v-if="last === true && card.completed === null"
                :card="card"
                :MoveCard="MoveCard">
            </add-reason>
    </div>
    <card-edit v-if="card.completed === null" :card="card" @Edit="edit = $event"></card-edit>
    </div>
    `,
    props: {
        card: Object,
        edit: Boolean,
        MoveCard: Function,
        last: Boolean,
    },
    methods: {

    }
})

Vue.component('add-reason', {
    props: {
        card: Object,
        MoveCard: Function,
    },
    template: `
    <form class="text-form-card" @submit.prevent="MoveCard(card, true)">
        <textarea v-model="card.reason" v-bind:placeholder="card.reason"></textarea>
        <button type="submit" :disabled="card.reason == null || card.reason == ''">Вернуть</button>
    </form>
    `,
    data() {
        return {
            reason: this.card.reason,
        }
    },
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