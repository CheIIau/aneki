<template>
  <div>
    <v-flex v-if="!loading"
            md10
            offset-md1
            offset-sm2
            offset-xs1
            sm8
            xs10>
      <v-flex v-if="!isUserLoggedIn"
              md10
              offset-md1
              offset-sm2
              offset-xs1
              sm8
              xs10>
        <v-alert v-model="alert"
                 dense
                 dismissible
                 outlined
                 shaped
                 text
                 type="info">
          Зарегистрируйтесь, чтобы выложить мемес
        </v-alert>
      </v-flex>

      <v-flex xs12
              class="button-group">
        <div class="text-right my-2">
          <span class="hidden-sm-and-down">&nbsp;</span>
          <v-menu offset-y
                  transition="slide-y-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="hidden-sm-and-down"
                     color="primary"
                     dark
                     v-bind="attrs"
                     v-on="on">
                Сортировать
              </v-btn>
              <v-btn block
                     class="hidden-md-and-up mb-3"
                     color="primary"
                     dark
                     v-bind="attrs"
                     v-on="on">
                Сортировать &nbsp;
                <v-icon>mdi-sort-ascending</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(item, index) in items"
                           :key="index"
                           class="pointer">
                <v-list-item-title @click="sortMemes(item.sort)">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div v-if="isUserLoggedIn"
             class="text-right my-2">
          <span class="hidden-sm-and-down">&nbsp;</span>
          <v-btn class="hidden-sm-and-down"
                 color="primary"
                 dark
                 @click="triggerUpload">
            Загрузить мемес
          </v-btn>
          <v-btn block
                 class="hidden-md-and-up mb-3"
                 color="primary"
                 dark
                 @click="triggerUpload">
            Загрузить мемес &nbsp;
            <v-icon>mdi-file-image-plus-outline</v-icon>
          </v-btn>
          <input ref="fileInput"
                 type="file"
                 style="display:none"
                 accept="image/*"
                 @change="onFileChange">
        </div>
      </v-flex>

      <v-flex v-if="!loading"
              md6
              offset-md3
              offset-sm2
              offset-xs1
              sm8
              xs10
              class="memes-content"
              :class="authMessageClasses">
        <meme-card v-for="meme in memes"
                   :id="meme.id"
                   :key="meme.imageUrl"
                   :author="meme.author"
                   :image-url="meme.imageUrl"
                   :rating="meme.rating"
                   :time="meme.time"></meme-card>
      </v-flex>
    </v-flex>

    <spinner v-else></spinner>

    <modal :image-src="imageSrc"
           :show-dialog="showDialog"
           @toggleDialog="toggleDialog">
      <template v-slot:header>
        Ваш мемес
      </template>
      <template v-slot:button>
        <v-btn color="success"
               text
               outlined
               @click="addMeme">
          Запостить
        </v-btn>
      </template>
    </modal>

    <div ref="observer"
         class="observer"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import Modal from '@/components/Modal.vue';
import MemeCard from '@/components/MemeCard.vue';
import Spinner from '@/components/Spinner.vue';

export default {
  components: {
    Modal,
    MemeCard,
    Spinner,
  },
  data() {
    return {
      alert: true,
      showDialog: false,
      image: null,
      imageSrc: '',
      items: [
        { title: 'Сначала новые', sort: 'new' },
        { title: 'Сначала старые', sort: 'old' },
        { title: 'Топ 100', sort: 'rating' },
      ],
      sort: 'new',
    };
  },
  computed: {
    ...mapGetters({
      memes: 'getMemes',
      loading: 'loading',
      isUserLoggedIn: 'isUserLoggedIn',
    }),
    authMessageClasses() {
      return this.isUserLoggedIn ? 'memes-content_authorized' : 'memes-content_unauthorized';
    },
  },
  async created() {
    this.clearMemes();
    await this.newMemes();
    const optionsObserver = {
      rootMargin: '0px',
      threshold: 1.0,
    };
    const callbackObserver = (entries) => {
      if (entries[0].isIntersecting && this.memes.length !== 0) {
        const lastMeme = this.memes.at(-1);
        if (this.sort === 'new') {
          this.newMemes({ lastMemesVal: lastMeme.reverseTime });
        } else if (this.sort === 'old') {
          this.oldMemes({ lastMemesVal: lastMeme.time });
        } else {
          return;
        }
      }
    };
    const observer = new IntersectionObserver(callbackObserver, optionsObserver);
    observer.observe(this.$refs.observer);
  },
  methods: {
    ...mapActions({
      uploadMeme: 'uploadMeme',
      oldMemes: 'fetchOldMemesFromDB',
      newMemes: 'fetchNewMemesFromDB',
      favouriteMemes: 'fetchFavouriteMemesFromDB',
    }),
    ...mapMutations(['clearMemes']),
    sortMemes(sort) {
      this.sort = sort;
      this.clearMemes();
      if (sort === 'new') {
        this.newMemes();
      } else if (sort === 'old') {
        this.oldMemes();
      } else if (sort === 'rating') {
        this.favouriteMemes();
      }
    },
    addMeme() {
      this.showDialog = false;
      if (this.image) {
        this.uploadMeme(this.image);
      }
    },
    toggleDialog() {
      this.showDialog = !this.showDialog;
    },
    onFileChange(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(file);
      this.image = file;
      this.showDialog = true;
    },
    triggerUpload() {
      this.$refs.fileInput.click();
    },
  },
};
</script>

<style scoped>
.observer {
  height: 60px;
}
.button-group {
  align-self: flex-end;
}
.memes-content_authorized {
  margin-top: -90px;
}
.memes-content_unauthorized {
  margin-top: -45px;
}
@media all and (max-width: 960px) {
  .memes-content {
    margin-top: 0px;
  }
}
</style>