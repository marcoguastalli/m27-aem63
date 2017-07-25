package net.marco27.aem6.components.osgi;

import java.util.Dictionary;

import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;

@Component(metatype = true, immediate = true, label = "Hello OSGi Component")
@Property(name = HelloOsgi.PROPERTY_NAME, value = { HelloOsgi.PROPERTY_DEFAULT_VALUE })
public class HelloOsgi {

    protected BundleContext bundleContext;

    protected static final String PROPERTY_NAME = "osgiPropertyName";
    protected static final String PROPERTY_DEFAULT_VALUE = "osgiPropertyValue";

    private String privateProperty;

    @Activate
    protected void activate(BundleContext bundleContext, ComponentContext componentContext) {
        this.bundleContext = componentContext.getBundleContext();
        Dictionary<?, ?> properties = componentContext.getProperties();
        this.privateProperty = PropertiesUtil.toString(properties.get(PROPERTY_NAME), PROPERTY_DEFAULT_VALUE);
    }
}