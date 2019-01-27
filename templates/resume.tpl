<div class="container">

    <div id="cv">
        <div id="contact" {{#resume.contact.id}} data-id="{{ resume.contact.id }}" {{/resume.contact.id}}>
            <div class="contact-name">{{ resume.contact.first_name }} {{ resume.contact.last_name }}</div>
            <div class="contact-email">
              <span class="header-date"> Email: </span>
              <span class="header-school-location">  {{ resume.contact.email }} </span>
              <span class="header-date"> Tel: </span>
              <span class="header-school-location">  {{ resume.contact.phone }} </span>
            </div>
            <div class="contact-email">{{ resume.contact.city }} ({{ resume.contact.visa}})</div>
            <div class="contact-website">
                  <span class="header-date"> Linkedin: </span>
                  <span class="header-school-location"> {{ resume.contact.website }},   </span>
                  <span class="header-date"> Github: </span>
                  <span class="header-school-location"> {{ resume.contact.github }} </span>
            </div>
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
            <div class="title-section" style="page-break-after: avoid">Skills:</div>
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
        {{ #resume.original.work.length}}
        <div id="work-experience" class="section">
          <div class="title-section">Work Experience Summary:</div>
          <div {{#item-work.id}} data-id="{{ item-work.id }}" {{/item-work.id}}>
          <table id="work-experience" class="section" style="page-break-before: auto; page-break-after: auto;">
            <tr class="work-item-header" style="page-break-inside: avoid;">
                <th class="header-employer" style="width:20%">Employments</th>
                <th class="header-accomplishments"> Major Accomplishments & Technologies </th>
            </tr>
            {{ #resume.original.work}}
              <tr class="work-item" {{#item-work.id}} data-id="{{ item-work.id }}" {{/item-work.id}} style="page-break-before: auto; page-break-after: auto; page-break-inside: avoid;">
                <td class="work-employer" rowspan="2" style="page-break-inside: avoid;">
                  <p style="page-break-inside: avoid;">{{ item-work.start-date}} &ndash; {{ item-work.end-date }}
                  <p class="bold-font" style="page-break-inside: avoid;">{{ item-work.company.name }}
                  <p style="page-break-inside: avoid;">{{ item-work.company.city }},{{ item-work.company.country }}
                  <p class="bold-font" style="page-break-inside: avoid;">{{ item-work.position }}
                </td>
                <td style="page-break-inside: avoid; page-break-after: avoid;">
                  {{#item-work.projects.length }}
                  <ul class="highlighted" style="page-break-inside: avoid;">
                    {{ #item-work.projects}}
                      <li style="page-break-inside: avoid;">{{item-projects.title}}</li>
                    {{/item-work.projects}}
                  </ul>
                  {{/item-work.projects.length }}
                </td>
              </tr>
              <tr style="page-break-inside: avoid;">
                <td style="page-break-inside: avoid;">
                  {{ #item-work.technologies.length }}
                  <span class="technologies-work" style="page-break-inside: avoid;">
                      {{ #item-work.technologies }}
                      {{ . }},
                      {{ /item-work.technologies }}
                  </span>
                  {{ /item-work.technologies.length }}
                </td>
             </tr>
             {{ /resume.original.work}}
            </table>
          </div>
        </div>
        {{ /resume.original.work.length}}
        {{ #resume.work.length }}
        <div id="work-experience" class="section">
            <div class="title-section" style="page-break-before: always; page-break-after: auto">Selected Projects</div>
            {{ #resume.work}}
            <div class="work-item" {{#item-work.id}} data-id="{{ item-work.id }}" {{/item-work.id}}>
                <span class="item-work-header-date">{{ item-work.start-date}} &ndash; {{ item-work.end-date }},</span>
                <span class="item-work-header-company-name">{{ item-work.position }}, {{ item-work.company.name }}</span>
                <span class="item-work-header-company-location" style="page-break-inside: avoid">, {{ item-work.company.city }},{{ item-work.company.country }}</span><br />
                <div class="description-work"> {{ item-work.achievements }} </div>
                {{ #item-work.projects.length }}
                <div id="projects" class="projects-section">
                    {{ #item-work.projects }}
                    <div class="project-item" {{#item-projects.id}} data-id="{{ item-projects.id }}" {{/item-projects.id}} >
                            <span class="item-projects-title" style="page-break-after: auto;page-break-inside: avoid"> {{ item-projects.title }} </span><br/>
                            <div class="description-work" style="page-break-inside: avoid"> {{ item-projects.description }} </div>
                            {{#item-projects.highlights.length}}
                            <div class="subtitle-section" style="page-break-after: avoid">Highlights:</div>
                            <ul class="highlighted" style="page-break-after: auto">
                                {{#item-projects.highlights}}
                                <li style="page-break-after: auto;page-break-inside: avoid">{{.}}</li>
                                {{/item-projects.highlights}}
                            </ul>
                            {{/item-projects.highlights.length}}
                            {{ #item-projects.technologies.length }}
                            <div class="subtitle-section" style="page-break-before: auto;page-break-after: avoid">Technologies:</div>
                            <span class="technologies-work" style="page-break-before: avoid;page-break-inside: avoid">
                                {{ #item-projects.technologies }}
                                {{ . }},
                                {{ /item-projects.technologies }}
                            </span>
                            {{ /item-projects.technologies.length }}
                    </div>
                    {{ /item-work.projects }}
                </div>
                {{ /item-work.projects.length }}
            </div>
            {{ /resume.work}}
        </div>
        {{ /resume.work.length }}
        <div id="hobbies" class="section" {{#resume.hobbies.id}} data-id="{{ resume.hobbies.id }}" {{/resume.hobbies.id}}>
            {{ #resume.hobbies.hobby-projects.length }}
            <div class="title-section" style="page-break-after: avoid">Hobbies Projects:</div>
            <div id="projects" class="projects-section">
                {{ #resume.hobbies.hobby-projects }}
                <div class="hobby-project-item" {{#item-projects.id}} data-id="{{ item-projects.id }}" {{/item-projects.id}}>
                        <span class="item-projects-title"> {{ item-projects.title }} </span><br/>
                        <div class="description-work"> {{ item-projects.description }} </div>
                        {{#item-projects.highlights.length}}
                        <div class="subtitle-section">Highlights:</div>
                        <ul class="highlighted">
                            {{#item-projects.highlights}}
                            <li>{{.}}</li>
                            {{/item-projects.highlights}}
                        </ul>
                        {{/item-projects.highlights.length}}
                        {{ #item-projects.technologies.length }}
                        <div class="subtitle-section">Technologies:</div>
                        <span class="technologies-work">
                            {{ #item-projects.technologies }}
                            {{ . }},
                            {{ /item-projects.technologies }}
                        </span>
                        {{ /item-projects.technologies.length }}
                </div>
                {{ /resume.hobbies.hobby-projects }}
            </div>
            {{ /resume.hobbies.hobby-projects.length }}
        </div>
    </div>
    <div id="extra">
        {{ #extraContent }}
            {{{ . }}}
        {{ /extraContent }}
    </div>
    <!--div id="print-foot"/-->

</div>
