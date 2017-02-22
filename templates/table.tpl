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
            <div> (Contact me for resume with project details)</div>
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

        {{ #resume.skills.length }}
        <div id="skills" class="section">
            <div class="title-section">Skills</div>
            <div>
              <ul class="highlighted">
                  {{ #resume.skills }}
                  <li>{{.}}</li>
                  {{ /resume.skills}}
              </ul>
            </div>
        </div>
        {{ /resume.skills.length }}

        {{ #resume.hobbies.hobby-items.length }}
        <div id="hobbies" class="section" {{#resume.hobbies.id}} data-id="{{ resume.hobbies.id }}" {{/resume.hobbies.id}}>
            <div class="title-section">Hobbies</div>
            <div class="hobbies-items">
                {{ #resume.hobbies.hobby-items.length }}
                <ul class="highlighted">
                  {{ #resume.hobbies.hobby-items}}
                    <li>
                      {{ item-hobbies.name}}
                      {{ #item-hobbies.additional-info }}
                          ({{ item-hobbies.additional-info }})
                      {{ /item-hobbies.additional-info }}
                    </li>
                  {{/resume.hobbies.hobby-items}}
                </ul>
                {{ /resume.hobbies.hobby-items.length}}
            </div>
        </div>
        {{ /resume.hobbies.hobby-items.length}}

        {{ #resume.work.length }}

        <div id="work-experience" class="section">
          <div class="title-section">Work Experience Summary:</div>
          <div {{#item-work.id}} data-id="{{ item-work.id }}" {{/item-work.id}}>
          <table id="work-experience" class="section" style="page-break-before: always; page-break-after: auto;">
            <tr class="work-item-header" style="page-break-inside: avoid;">
                <th class="header-employer" style="width:20%">Employments</th>
                <th class="header-accomplishments" style="width:55%"> Major Accomplishments </th>
                <th class="header-technologies"> Technologies </th>
            </tr>
            {{ #resume.work}}
            <tr class="work-item" {{#item-work.id}} data-id="{{ item-work.id }}" {{/item-work.id}} style="page-break-inside: avoid;">
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
      </div>
        </div>
        {{ /resume.work.length }}
    </div>
    <div id="extra">
        {{ #extraContent }}
            {{{ . }}}
        {{ /extraContent }}
    </div>
</div>
