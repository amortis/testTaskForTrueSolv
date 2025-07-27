# Item Purchase Tool

[English](#english)

[Русский](#русский)

---

<a name="english"></a>
# English

## Table of Contents

*   [Introduction](#introduction)
*   [Requirements](#requirements)
*   [Data Model](#data-model)
*   [User Stories](#user-stories)
*   [Tools](#tools)

---

<a name="introduction"></a>
## Introduction

This repository contains the implementation of a simple one-page application for creating purchase orders, developed on the Salesforce platform using LWC and Apex.

<a name="requirements"></a>
## Requirements

The project is implemented according to the following requirements:

*   Creation of custom objects according to the provided Data Model.
*   All requirements are represented as User Stories with useful links.
*   Only LWC components and Apex classes can be used. Aura components can only be used as a container for LWC components if needed.
*   Apex code covered by Unit Tests.
*   Create a GitHub repository with frequent commits.
*   Create an Admin user for `dev@truesolv.com` on Salesforce Dev Instance after the task is completed.
*   Create an unmanaged package.
*   More information and links to documentation can be found in the 'Tools' section.

<a name="data-model"></a>
## Data Model

The project uses the following custom objects and fields:

*   **Purchase__c** - new custom object
    *   `Name` - String
    *   `ClientId` - Lookup to Account object
    *   `TotalItems` - Number
    *   `GrandTotal` - Number
*   **PurchaseLine__c** - new custom object
    *   `PurchaseId` - Master-Detail to Purchase__c
    *   `ItemId` - Master-Detail to Item__c
    *   `Amount` - Number
    *   `UnitCost` - Number
*   **Item__c** - new custom object
    *   `Name` - String
    *   `Description` - String
    *   `Type` - Picklist
    *   `Family` - Picklist
    *   `Image` - Url - link to image
    *   `Price` - Number
*   **User** - standard object
    *   `IsManager` - Boolean (new custom field)

<a name="user-stories"></a>
## User Stories

The application's functionality is described by the following user stories:

*   **As a user, I can open an Item Purchase Tool page from Account layout.** (You need to put a button to Account layout that will open an Item Purchase Tool page in a separate tab. The Account Object is not the same as the User object.)
    *   Standard Account Object
*   **As a user, I can see Account Name, Number, Account Industry on the page.**
    *   Data Binding in a Template
*   **As a user, I can filter the displayed items by Family and Type.**
*   **As a user, I can see the count of listed items on the screen in the filter section.**
    *   Call Apex Method from LWC
    *   Render Lists in LWC
    *   Run code on load (ConnectedCallback)
*   **As a user, I can search for the item by Name and Description.**
*   **As a user, I can see item details in a modal window.** (Details button on Item Tile. Also, I can see an image of the item based on the Image URL.)
    *   Modal Window
    *   LWC Record Edit Form
    *   LWC Record View Form
*   **As a user, I can select an item and add it to Cart.** (Add button on Item Tile.)
    *   Show Toast message
*   **As a user, I can see items in the Cart.** (Cart button will open a modal with selected items in table view.)
*   **As a user, I can check out a Cart.** (Checkout button on Cart Modal.) This action will create Purchase and Purchase Line records.
    *   `TotalItems` and `GrandTotal` on `Purchase__c` object should be calculated automatically in a Trigger based on Purchase Line records.
    *   Apex Trigger
*   **As a user, after checking out the cart I should be redirected to the standard Purchase layout to see created Purchase and Purchase Line records.**
*   **As a manager, I should have the ability to create a new item in the modal window.** (Create an Item button. The button should be available only for users with `IsManager__c = true`.)
    *   Render DOM Elements Conditionally
*   **To fill out the Image field on the Item object, you need to send a request to the Unsplash API to get photos by a search query.** (Where `query = {Your Item Name}` is the name of the created item, and put the link in the Image field.)
    *   Create an Unsplash Account and Register an App.
    *   Get the Access Key.
    *   Search for Photos via API Endpoint.

<a name="tools"></a>
## Tools

The following tools and technologies were used for development and deployment:

*   **Salesforce Dev Org** - [Salesforce Developer Portal](https://developer.salesforce.com/)
*   **IDE** - IntelliJ IDEA + JetForcer
*   **Backend** - Apex - [Apex Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_dev_guide.htm)
*   **Client-Side** - LWC - [LWC Docs](https://developer.salesforce.com/docs/component-library/documentation/lwc)
*   **Styles** - Lightning Design System - [SLDS](https://www.lightningdesignsystem.com/)

---

<a name="русский"></a>
# Русский

## Оглавление

*   [Введение](#введение)
*   [Требования](#требования)
*   [Модель данных](#модель-данных)
*   [Пользовательские истории](#пользовательские-истории)
*   [Инструменты](#инструменты-рус)

---

<a name="введение"></a>
## Введение

Этот репозиторий содержит реализацию простого одностраничного приложения для создания заказов на покупку, разработанного на платформе Salesforce с использованием LWC и Apex.

<a name="требования"></a>
## Требования

Проект реализован в соответствии со следующими требованиями:

*   Создание пользовательских объектов согласно предоставленной модели данных.
*   Все требования представлены в виде пользовательских историй с полезными ссылками.
*   Использование только LWC компонентов и Apex классов. Компоненты Aura могут быть использованы только в качестве контейнера для LWC компонентов при необходимости.
*   Покрытие кода Apex модульными тестами.
*   Создание репозитория на GitHub с частыми коммитами.
*   Создание пользователя Admin для `dev@truesolv.com` на Salesforce Dev Instance после завершения задачи.
*   Создание неуправляемого пакета.
*   Дополнительная информация и ссылки на документацию доступны в разделе 'Инструменты'.

<a name="модель-данных"></a>
## Модель данных

Проект использует следующие пользовательские объекты и поля:

*   **Purchase__c** - новый пользовательский объект
    *   `Name` - String
    *   `ClientId` - Lookup на объект Account
    *   `TotalItems` - Number
    *   `GrandTotal` - Number
*   **PurchaseLine__c** - новый пользовательский объект
    *   `PurchaseId` - Master-Detail на Purchase__c
    *   `ItemId` - Master-Detail на Item__c
    *   `Amount` - Number
    *   `UnitCost` - Number
*   **Item__c** - новый пользовательский объект
    *   `Name` - String
    *   `Description` - String
    *   `Type` - Picklist
    *   `Family` - Picklist
    *   `Image` - Url - ссылка на изображение
    *   `Price` - Number
*   **User** - стандартный объект
    *   `IsManager` - Boolean (новое пользовательское поле)

<a name="пользовательские-истории"></a>
## Пользовательские истории

Функциональность приложения описана следующими пользовательскими историями:

*   **Как пользователь, я могу открыть страницу Item Purchase Tool из макета Account.** (Необходимо разместить кнопку на макете Account, которая будет открывать страницу Item Purchase Tool в отдельной вкладке. Объект Account не совпадает с объектом User.)
    *   Стандартный объект Account
*   **Как пользователь, я могу видеть имя, номер и отрасль Account на странице.**
    *   Привязка данных в шаблоне
*   **Как пользователь, я могу фильтровать отображаемые элементы по Family и Type.**
*   **Как пользователь, я могу видеть количество перечисленных элементов на экране в разделе фильтра.**
    *   Вызов метода Apex из LWC
    *   Отображение списков в LWC
    *   Выполнение кода при загрузке (ConnectedCallback)
*   **Как пользователь, я могу искать элемент по имени и описанию.**
*   **Как пользователь, я могу видеть детали элемента в модальном окне.** (Кнопка "Details" на плитке элемента. Также я могу видеть изображение элемента на основе URL изображения.)
    *   Модальное окно
    *   Форма редактирования записи LWC
    *   Форма просмотра записи LWC
*   **Как пользователь, я могу выбрать элемент и добавить его в корзину.** (Кнопка "Add" на плитке элемента.)
    *   Показать сообщение Toast
*   **Как пользователь, я могу видеть элементы в корзине.** (Кнопка "Cart" откроет модальное окно с выбранными элементами в табличном представлении.)
*   **Как пользователь, я могу оформить заказ из корзины.** (Кнопка "Checkout" в модальном окне корзины.) Это действие создаст записи Purchase и Purchase Line.
    *   `TotalItems` и `GrandTotal` в объекте `Purchase__c` должны автоматически рассчитываться в триггере на основе записей Purchase Line.
    *   Триггер Apex
*   **Как пользователь, после оформления заказа я должен быть перенаправлен на стандартный макет Purchase, чтобы увидеть созданные записи Purchase и Purchase Line.**
*   **Как менеджер, я должен иметь возможность создавать новый элемент в модальном окне.** (Кнопка "Create an Item". Кнопка должна быть доступна только для пользователей с `IsManager__c = true`.)
    *   Условное отображение элементов DOM
*   **Для заполнения поля Image в объекте Item необходимо отправить запрос к Unsplash API для получения фотографий по поисковому запросу.** (Где `query = {Your Item Name}` - это имя созданного элемента, и поместите ссылку в поле Image.)
    *   Создание учетной записи Unsplash и регистрация приложения.
    *   Получение Access Key.
    *   Поиск фотографий через API Endpoint.

<a name="инструменты-рус"></a>
## Инструменты

Для разработки и развертывания использовались следующие инструменты и технологии:

*   **Salesforce Dev Org** - [Salesforce Developer Portal](https://developer.salesforce.com/)
*   **IDE** - IntelliJ IDEA + JetForcer
*   **Backend** - Apex - [Apex Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_dev_guide.htm)
*   **Client-Side** - LWC - [LWC Docs](https://developer.salesforce.com/docs/component-library/documentation/lwc)
*   **Styles** - Lightning Design System - [SLDS](https://www.lightningdesignsystem.com/)


