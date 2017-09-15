package net.marco27.aem6.components.osgi;

import java.io.IOException;
import java.io.PrintWriter;

import javax.annotation.Nonnull;
import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@Component(immediate = true,
        service = Servlet.class,
        property = { "sling.servlet.resourceTypes=m27/website/osgi/helloosgiservletwithdefinition" })
@Designate(ocd = HelloOsgiServletWithDefinition.Configuration.class)
public class HelloOsgiServletWithDefinition extends SlingSafeMethodsServlet {

    @Override
    public void doGet(@Nonnull final SlingHttpServletRequest request, @Nonnull final SlingHttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        out.print("GET");
    }

    @Activate
    protected void activate(Configuration config) {
        boolean enabled = config.servletname_enabled();
    }

    @ObjectClassDefinition(name = "M27 OSGi R6 Annotation Declarative Servlet")
    public @interface Configuration {

        @AttributeDefinition(name = "Enable", description = "Enable the servlet")
        boolean servletname_enabled() default false;
    }
}
