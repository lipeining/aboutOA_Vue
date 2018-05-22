<template>
  <!--original categories list-->
  <!--<el-row :gutter="22">-->
  <!--<draggable element="div" class="category-group" v-model="categories" :options="categoryOptions"-->
  <!--:move="onMove" @start="startDrag" @end="endDrag"-->
  <!--@change="handleCateChange">-->
  <!--<transition-group type="transition" class="list-group">-->
  <!--<el-row v-for="category in categories" :key="category.id" class="category">-->
  <!--<el-row class="category-form-row">-->
  <!--<el-form auto-complete="on" :model="category" class="category-form"-->
  <!--label-width="60px" size="medium" :disabled="!editable"-->
  <!--:inline="true" :rules="rules" :ref="setCateFormName(category.id)">-->
  <!--<el-form-item prop="name">-->
  <!--<el-input style="width:10em" type="text"-->
  <!--v-model="category.name" placeholder="Please enter name">-->
  <!--</el-input>-->
  <!--</el-form-item>-->
  <!--<el-form-item prop="intro">-->
  <!--<el-input type="text" v-model="category.intro" placeholder="Please enter intro">-->
  <!--</el-input>-->
  <!--</el-form-item>-->
  <!--<el-button type="primary" icon="el-icon-success" circle-->
  <!--@click="updateCategory(setCateFormName(category.id), category.id)">-->
  <!--</el-button>-->
  <!--<el-button type="danger" icon="el-icon-delete" circle-->
  <!--@click="deleteCategory(category.id)">-->
  <!--</el-button>-->
  <!--</el-form>-->
  <!--</el-row>-->

  <!--<el-row :gutter="20" class="project-content">-->
  <!--<draggable class="list-group" element="div" v-model="category.Projects"-->
  <!--:options="projectOptions" :move="onMove"-->
  <!--@change="handleProChange" @start="startDrag" @end="endDrag"-->
  <!--@add="handleProAdd" @remove="handleProRemove" @update="handleProUpdate">-->
  <!--<transition-group type="transition" class="project-group">-->
  <!--<el-col :span="3" v-for="project in category.Projects" :key="project.id"-->
  <!--class="project-content ">-->
  <!--<div class="grid-content">-->
  <!--<el-popover-->
  <!--placement="top-start"-->
  <!--:title="project.name"-->
  <!--width="400"-->
  <!--trigger="hover">-->
  <!--<el-row>-->
  <!--<el-tag v-if="project.segment.inner">inner</el-tag>-->
  <!--<el-tag v-if="project.segment.middle" type="warning">middle</el-tag>-->
  <!--<el-tag v-if="project.segment.outer" type="success">outer</el-tag>-->
  <!--</el-row>-->
  <!--<el-row :gutter="20">-->
  <!--<el-col :span="12" class="project-intro">-->
  <!--<p>{{project.intro}}</p>-->
  <!--</el-col>-->
  <!--<el-col :span="8" class="project-intro">-->
  <!--<img v-if="project.logo"-->
  <!--:src="project.logo" :alt="project.logo"-->
  <!--class="logo">-->
  <!--</el-col>-->
  <!--</el-row>-->
  <!--<el-row :gutter="20">-->
  <!--<el-col :span="12">-->
  <!--<p><strong class="hint">*hint:</strong>{{project.hint}}</p>-->
  <!--</el-col>-->
  <!--<el-col :span="8">-->
  <!--<div v-if="project.url">-->
  <!--&lt;!&ndash;<a :href="'http://vue-loader.vuejs.org/'" target="_blank">进入网站</a>&ndash;&gt;-->
  <!--<a :href="project.url" target="_blank">进入网站</a>-->
  <!--</div>-->
  <!--<div v-else-if="project.QRCode">-->
  <!--<el-popover-->
  <!--placement="right"-->
  <!--width="200"-->
  <!--trigger="click">-->
  <!--<img v-if="project.QRCode"-->
  <!--:src="project.QRCode" :alt="project.QRCode"-->
  <!--class="QRCode">-->
  <!--<el-button slot="reference">点击下载</el-button>-->
  <!--</el-popover>-->
  <!--</div>-->
  <!--<div v-else>-->
  <!--<p>no url and no QR code</p>-->
  <!--</div>-->
  <!--</el-col>-->
  <!--</el-row>-->
  <!--<el-row>-->
  <!--<el-button type="success" icon="el-icon-edit-outline"-->
  <!--@click="">-->
  <!--</el-button>-->
  <!--<el-button type="danger" icon="el-icon-delete"-->
  <!--@click="deleteProject(project.id, project.categoryId)">-->
  <!--</el-button>-->
  <!--</el-row>-->
  <!--<img v-if="project.logo" slot="reference"-->
  <!--:src="project.logo" :alt="project.logo"-->
  <!--class="logo">-->
  <!--</el-popover>-->
  <!--</div>-->
  <!--</el-col>-->
  <!--</transition-group>-->
  <!--</draggable>-->
  <!--&lt;!&ndash;</div>&ndash;&gt;-->
  <!--<el-col :span="6">-->
  <!--<el-tooltip class="item" effect="dark" content="new project" placement="right">-->
  <!--<el-button type="success" @click="addProForm(category.id)" icon="el-icon-plus" circle>-->
  <!--</el-button>-->
  <!--</el-tooltip>-->
  <!--</el-col>-->
  <!--</el-row>-->
  <!--&lt;!&ndash;</div>&ndash;&gt;-->
  <!--</el-row>-->
  <!--</transition-group>-->
  <!--</draggable>-->
  <!--</el-row>-->
</template>

<script>
  export default {
    name: "categories-copy"
  }
</script>

<style scoped>

</style>
