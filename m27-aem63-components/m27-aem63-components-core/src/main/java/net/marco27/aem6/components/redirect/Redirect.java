package net.marco27.aem6.components.redirect;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

@Model(adaptables = Resource.class, adapters = Redirect.class)
public class Redirect {

    private static final String REDIRECT_TARGET_PROPERTY = "redirectTarget";

    @ValueMapValue(name = REDIRECT_TARGET_PROPERTY, injectionStrategy = InjectionStrategy.OPTIONAL)
    private String redirectTarget;

    private String redirectUrl;

    private PageManager pageManager;

    public Redirect(Resource resource) {
        pageManager = resource.getResourceResolver().adaptTo(PageManager.class);
        if (pageManager == null) {
            throw new IllegalStateException("Could not get page manager from resource resolver");
        }
    }

    @PostConstruct
    public void init() {
        // cache redirect url as this is used for all getter methods
        redirectUrl = StringUtils.isNotEmpty(redirectTarget) ? getRedirectUrl(redirectTarget) : null;
    }

    /**
     * Validate the redirectTarget to verify if the target is an external or internal page.
     *
     * @param path
     * @return String
     */
    private String getRedirectUrl(String path) {
        if (StringUtils.isBlank(path)) {
            return null;
        }
        final int protocolIndex = path.indexOf(":/");
        final int queryIndex = path.indexOf('?');
        if (protocolIndex > -1 || queryIndex > -1) {
            return path;
        } else {
            return path + ".html";
        }
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public boolean isHasContent() {
        return StringUtils.isNotBlank(redirectTarget);
    }

    public String getTitleOfRedirectTarget() {
        Page redirectTargetPage = pageManager.getPage(redirectTarget);
        if (redirectTargetPage != null) {
            return redirectTargetPage.getTitle();
        } else {
            return redirectUrl;
        }
    }

}
