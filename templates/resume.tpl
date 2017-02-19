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
        <div id="work-experience" class="section">
            <div class="title-section">Work Experience</div>
            {{ #resume.work}}
            <div class="work-item" {{#item-work.id}} data-id="{{ item-work.id }}" {{/item-work.id}}>
                <span class="header-date">{{ item-work.start-date}} &ndash; {{ item-work.end-date }},</span>
                <span class="header-company-name">{{ item-work.position }}, {{ item-work.company.name }}</span>
                <span class="header-company-location">, {{ item-work.company.city }},{{ item-work.company.country }}</span><br />
                <div class="description-work"> {{ item-work.achievements }} </div>
                {{ #item-work.technologies.length }}
                <div class="technologies-work">
                    {{ #item-work.technologies }}
                    <span>{{ . }}</span>
                    {{ /item-work.technologies }}
                </div>
                {{ /item-work.technologies.length }}
                {{ #item-work.projects.length }}
                <div id="projects" class="projects-section">
                    {{ #item-work.projects }}
                    <div class="project-item" {{#item-projects.id}} data-id="{{ item-projects.id }}" {{/item-projects.id}}>
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
                    {{ /item-work.projects }}
                </div>
                {{ /item-work.projects.length }}
            </div>
            {{ /resume.work}}
        </div>
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
