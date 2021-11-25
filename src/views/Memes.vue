<template>
  <div>
    <v-flex md10
            offset-md1
            offset-sm2
            offset-xs1
            sm8
            v-if="!loading"
            xs10>
      <div v-if="isUserLoggedIn"
           class="text-right uploadMeme-block">
        <span class="hidden-sm-and-down">&nbsp;</span>
        <div offset-y
             transition="slide-y-transition">
          <v-btn class="hidden-sm-and-down"
                 color="primary"
                 dark
                 @click="triggerUpload">Загрузить мемес</v-btn>
          <v-btn block
                 class="hidden-md-and-up mb-3"
                 color="primary"
                 dark
                 @click="triggerUpload">
            Загрузить мемес &nbsp;
            <v-icon>mdi-file-image-plus-outline</v-icon>
          </v-btn>
          <input @change="onFileChange"
                 ref="fileInput"
                 type="file"
                 style="display:none"
                 accept="image/*">
        </div>
      </div>
      <v-flex v-else
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

      <v-flex md6
              offset-md3
              offset-sm2
              offset-xs1
              sm8
              v-if="!loading"
              xs10>
        <meme-card v-for="meme in memes"
                   :author="meme.author"
                   :imageUrl="meme.imageUrl"
                   :key="meme.imageUrl"
                   :rating="meme.rating"
                   :time="meme.time"
                   :id="meme.id"></meme-card>
      </v-flex>
    </v-flex>

    <spinner v-else></spinner>
    <modal :imageSrc="imageSrc"
           :showDialog="showDialog"
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Modal from '@/components/Modal.vue';
import MemeCard from '@/components/MemeCard.vue';
import Spinner from '@/components/Spinner.vue';

export default {
  data() {
    return {
      alert: true,
      showDialog: false,
      image: null,
      imageSrc: '',
    };
  },
  components: {
    Modal,
    MemeCard,
    Spinner,
  },
  computed: {
    ...mapGetters({
      memes: 'getMemes',
      loading: 'loading',
      isUserLoggedIn: 'isUserLoggedIn',
    }),
  },
  async created() {
    await this.fetchOldMemesFromDB();
  },
  methods: {
    ...mapActions(['uploadMeme', 'fetchOldMemesFromDB']),
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
.uploadMeme-block {
  display: flex;
  justify-content: flex-end;
}
</style>