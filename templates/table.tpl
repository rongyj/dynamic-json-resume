<div class="container">
    <div id="cv">
        <div id="contact" {{#resume.contact.id}} data-id="{{ resume.contact.id }}" {{/resume.contact.id}}>
            <div class="contact-name">{{ resume.contact.first_name }} {{ resume.contact.last_name }}</div>
            <div class="contact-email">{{ resume.contact.email }}</div>
            {{ #resume.contact.website }}
                <div class="contact-website"> {{ resume.contact.website }}</div>
            {{ /resume.contact.website }}
            {{ #resume.contact.github }}
            <div class="contact-external"> {{ resume.contact.github }} </div>
            {{ /resume.contact.github }}
            <div class="contact-city">{{ resume.contact.city }}</div>
        </div>

        {{ #resume.education.length }}
        <div id="education" class="section">
            <div class="title-section">Education</div>
            {{ #resume.education }}
            <div class="education-item" {{#item-education.id}} data-id="{{ item-education.id }}" {{/item-education.id}}>
                <span class="header-date">{{ item-education.end-date }},</span>
                <span class="description-education">{{ item-education.description }},</span>
                <span class="header-school-name">{{ item-education.institution.name }},</span>
                <span class="header-school-location">{{ item-education.institution.city }}, {{ item-education.institution.country }}</span>
            </div>
            {{ /resume.education }}
        </div>
        {{ /resume.education.length }}

        {{ #resume.work.length }}
        <table id="work-experience" class="section">
            <tr class="work-item-header">
                <th class="header-employer" style="width:18%">Employements and Titles</th>
                <th class="header-accomplishments" style="width:60%"> Major Accomplishments </th>
                <th class="header-Technologies"> Technologies </th>
            </tr>
            {{ #resume.work}}
            <tr class="work-item" {{#item-work.id}} data-id="{{ item-work.id }}" {{/item-work.id}}>
                <td class="work-employer">
                  <p>{{ item-work.start-date}} &ndash; {{ item-work.end-date }}
                  <p class="bold-font">{{ item-work.company.name }}
                  <p>{{ item-work.company.city }},{{ item-work.company.country }}
                  <p class="bold-font">{{ item-work.position }}
                </td>
                <td>
                  {{#item-work.projects.length }}
                  <ul class="highlighted">
                    {{ #item-work.projects}}
                      <li>{{item-projects.title}}</li>
                    {{/item-work.projects}}
                  </ul>
                  {{/item-work.projects.length }}
                </td>
                <td>
                  {{ #item-work.technologies.length }}
                  <span class="technologies-work">
                      {{ #item-work.technologies }}
                      {{ . }},
                      {{ /item-work.technologies }}
                  </span>
                  {{ /item-work.technologies.length }}
                </td>
            </tr>
            {{ /resume.work}}
        </table>
        {{ /resume.work.length }}

        {{ #resume.skills.length }}
        <div id="skills" class="section">
            <div class="title-section">Skills</div>
            <div class="skills-items">
            {{ #resume.skills }}
                <span> {{ . }} </span>
            {{ /resume.skills}}
            </div>
        </div>
        {{ /resume.skills.length }}

        {{ #resume.languages.length }}
        <div id="languages" class="section">
            <div class="title-section">Languages</div>
            {{ #resume.languages }}
            <div class="language-item" {{#item-languages.id}} data-id="{{ item-languages.id }}" {{/item-languages.id}}> {{ item-languages.name }}
            {{ #item-languages.additional-info }}
             ({{ item-languages.additional-info }})
            {{ /item-languages.additional-info }}
            </div>
            {{ /resume.languages }}
        </div>
        {{ /resume.languages.length }}

        {{ #resume.hobbies.length }}
        <div id="hobbies" class="section" {{#resume.hobbies.id}} data-id="{{ resume.hobbies.id }}" {{/resume.hobbies.id}}>
            <div class="title-section">Hobbies</div>
            <div class="hobbies-items">
                {{ #resume.hobbies }}
                <span class="hooby-item" {{#item-hobbies.id}} data-id="{{ item-hobbies.id }}" {{/item-hobbies.id}}>{{ item-hobbies.name}}
                {{ #item-hobbies.additional-info }}
                    ({{ item-hobbies.additional-info }})
                {{ /item-hobbies.additional-info }}
                </span><br /> <!-- book i read !-->
                {{ /resume.hobbies }}
            </div>
        </div>
        {{ /resume.hobbies.length}}
    </div>
    <div id="extra">
        {{ #extraContent }}
            {{{ . }}}
        {{ /extraContent }}
    </div>
</div>
