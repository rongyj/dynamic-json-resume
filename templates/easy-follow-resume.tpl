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
            <div class="contact-city">Tel: 856-408-4027</div>
        </div>


        {{ #resume.skills.length }}
        <div id="skills" class="section">
            <div class="title-section" style="page-break-after: avoid">Skills:</div>
            <div>
              <ul class="skills-highlighted">
                  {{ #resume.skills }}
                  <li>{{.}}</li>
                  {{ /resume.skills}}
              </ul>
            </div>
        </div>
        {{ /resume.skills.length }}
        {{ #resume.work.length }}
        <div id="work-experience" class="section">
            <div class="title-section" style="page-break-after: avoid">Work Experience</div>
            {{ #resume.work}}
            <div class="work-item" {{#item-work.id}} data-id="{{ item-work.id }}" {{/item-work.id}}>
              <div id="company-header">
                <p class="header-company-name" style="text-align:left">{{ item-work.position }}
                  <span class="header-date" style="float:right">{{ item-work.start-date}} &ndash; {{ item-work.end-date }}</span>
                </p>
              </div>
                <div class="header-company-name" style="page-break-inside: avoid">{{ item-work.company.name }}, {{ item-work.company.city }},{{ item-work.company.country }}</div><br />
                <div class="description-work"> {{ item-work.achievements }} </div>
                {{ #item-work.projects.length }}
                <div id="projects" class="projects-section">
                    {{ #item-work.projects }}
                    <ul class="projects-section">
                    <div class="project-item" {{#item-projects.id}} data-id="{{ item-projects.id }}" {{/item-projects.id}} >
                            <li class="item-projects-title"> {{ item-projects.title }} </li>
                            <div class="description-project"> {{ item-projects.description }} </div>
                            {{#item-projects.highlights.length}}
                            <div class="subtitle-section" style="page-break-after: avoid;page-break-before:auto">Highlights:</div>
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
                  </ul>
                    {{ /item-work.projects }}
                </div>
                {{ /item-work.projects.length }}
            </div>
            {{ /resume.work}}
        </div>
        {{ /resume.work.length }}
        <div id="hobbies" class="section" {{#resume.hobbies.id}} data-id="{{ resume.hobbies.id }}" {{/resume.hobbies.id}}>
            <div class="title-section" style="page-break-after: avoid">Hobbies</div>
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
            {{ #resume.hobbies.hobby-projects.length }}
            <div id="projects" class="projects-section">
                {{ #resume.hobbies.hobby-projects }}
                <ul class="projects-section">
                <div class="hobby-project-item" {{#item-projects.id}} data-id="{{ item-projects.id }}" {{/item-projects.id}}>
                        <li class="item-projects-title"> {{ item-projects.title }} </li><br/>
                        <div class="description-project"> {{ item-projects.description }} </div>
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
              </ul>
                {{ /resume.hobbies.hobby-projects }}
            </div>
            {{ /resume.hobbies.hobby-projects.length }}
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
    </div>
    <div id="extra">
        {{ #extraContent }}
            {{{ . }}}
        {{ /extraContent }}
    </div>
    <!--div id="print-foot"/-->

</div>
